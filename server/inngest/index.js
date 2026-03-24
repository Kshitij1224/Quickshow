import sendEmail from "../config/nodeMailer.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/user.js";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url,
        };
        await User.create(userData);
    }
);

const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url,
        };
        await User.findByIdAndUpdate(id, userData);
    }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: "release-seats-delete-booking" },
    { event: "app/checkpayment" },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

        await step.run("check-payment-status", async () => {
            const bookingId = event.data?.bookingId;

            if (!bookingId) {
                console.error("bookingId missing in event");
                return;
            }

            const booking = await Booking.findById(bookingId);

            if (!booking) {
                console.error("Booking not found:", bookingId);
                return;
            }

            if (booking.isPaid) {
                console.log("Booking already paid:", bookingId);
                return;
            }

            const show = await Show.findById(booking.show);

            if (!show) {
                console.error("Show not found for booking:", bookingId);
                return;
            }

            if (show.occupiedSeats) {
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });

                show.markModified("occupiedSeats");
                await show.save();
            }

            await Booking.findByIdAndDelete(booking._id);

            console.log("Released seats and deleted booking:", bookingId);
        });
    }
);

const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId)
            .populate({
                path: "show",
                populate: { path: "movie", model: "Movie" },
            })
            .populate("user");

        if (!booking) {
            throw new Error(`Booking not found for ID: ${bookingId}`);
        }

        if (!booking.user) {
            throw new Error(`User not populated in booking: ${bookingId}`);
        }

        if (!booking.show) {
            throw new Error(`Show not populated in booking: ${bookingId}`);
        }

        try {
            await sendEmail({
                to: booking.user.email,
                subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
                body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
                   <h2>Hi ${booking.user.name},</h2>
                   <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
                   <p>
                   <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}<br/>
                   <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
                   </p>
                   <p>Enjoy the show!</p>
                    <p>Thanks for booking with us!<br/>QuickShow Team</p>
                    </div>`,
            });
        } catch (error) {
            console.error(`Booking confirmation mail failed for booking ${bookingId}:`, error.message);
            throw error;
        }
    }
);

const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders" },
    { cron: "0 */8 * * *" },
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
            const shows = await Show.find({
                showDateTime: { $gte: windowStart, $lte: in8Hours },
            }).populate("movie");

            const tasks = [];

            for (const show of shows) {
                if (!show.movie || !show.occupiedSeats) continue;

                const userIds = [...new Set(Object.values(show.occupiedSeats))];
                if (userIds.length === 0) continue;

                const users = await User.find({ _id: { $in: userIds } }).select("name email");

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showDateTime,
                    });
                }
            }

            return tasks;
        });

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No reminders to send." };
        }

        const results = await step.run("send-all-reminders", async () => {
            return Promise.allSettled(
                reminderTasks.map((task) =>
                    sendEmail({
                        to: task.userEmail,
                        subject: `Movie Reminder: "${task.movieTitle}" starts soon!`,
                        body: `<div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #F84565;">Hi ${task.userName},</h2>
                            <p>This is a friendly reminder that your movie <strong style="color: #F84565;">"${task.movieTitle}"</strong> starts in about 8 hours!</p>
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Movie:</strong> ${task.movieTitle}</p>
                                <p><strong>Show Time:</strong> ${new Date(task.showTime).toLocaleString("en-US", {
                                    timeZone: "Asia/Kolkata",
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</p>
                            </div>
                            <p>Please arrive 15 minutes before the show time. Enjoy the movie!</p>
                            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">See you at the movies!<br/>QuickShow Team</p>
                        </div>`,
                    })
                )
            );
        });

        const successful = results.filter((result) => result.status === "fulfilled").length;
        const failed = results.filter((result) => result.status === "rejected").length;

        return {
            sent: successful,
            failed,
            total: reminderTasks.length,
            message: `Sent ${successful} reminders, ${failed} failed.`,
        };
    }
);

const sendNewShowNotifications = inngest.createFunction(
    { id: "send-new-show-notifications" },
    { event: "app/show.added" },
    async ({ event, step }) => {
        const { showId } = event.data;

        const showData = await step.run("get-show-details", async () => {
            const show = await Show.findById(showId).populate("movie");
            if (!show || !show.movie) {
                throw new Error("Show or movie not found");
            }
            return show;
        });

        const users = await step.run("get-all-users", async () => {
            return User.find({}).select("name email");
        });

        if (users.length === 0) {
            return { sent: 0, message: "No users to notify" };
        }

        const results = await step.run("send-notifications", async () => {
            return Promise.allSettled(
                users.map((user) =>
                    sendEmail({
                        to: user.email,
                        subject: `New Show Available: "${showData.movie.title}"`,
                        body: `<div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #F84565;">Hi ${user.name},</h2>
                            <p>Great news! A new show has been added for <strong style="color: #F84565;">"${showData.movie.title}"</strong>.</p>
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Movie:</strong> ${showData.movie.title}</p>
                                <p><strong>Duration:</strong> ${showData.movie.runtime} minutes</p>
                                <p><strong>Show Time:</strong> ${new Date(showData.showDateTime).toLocaleString("en-US", {
                                    timeZone: "Asia/Kolkata",
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</p>
                            </div>
                            <p>Book your tickets now before they sell out.</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/movies/${showData.movie._id}" 
                                   style="background-color: #F84565; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                                    Book Now
                                </a>
                            </div>
                            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">QuickShow Team</p>
                        </div>`,
                    })
                )
            );
        });

        const successful = results.filter((result) => result.status === "fulfilled").length;
        const failed = results.filter((result) => result.status === "rejected").length;

        return {
            sent: successful,
            failed,
            total: users.length,
            message: `Sent ${successful} new show notifications, ${failed} failed.`,
        };
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications,
];
