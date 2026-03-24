import Booking from "../models/Booking.js";
import sendEmail from "./nodeMailer.js";

export const sendBookingConfirmationEmail = async (bookingId, options = {}) => {
    const normalizedOptions = typeof options === "string"
        ? { recipientOverride: options, force: true }
        : options;
    const { recipientOverride = "", force = false } = normalizedOptions;

    const booking = await Booking.findById(bookingId)
        .populate({
            path: "show",
            populate: { path: "movie", model: "Movie" }
        })
        .populate("user");

    if (!booking) {
        throw new Error(`Booking not found for id ${bookingId}`);
    }

    if (!booking?.user?.email || !booking?.show?.movie) {
        throw new Error(`Booking email data is incomplete for id ${bookingId}`);
    }

    const to = recipientOverride || booking.user.email;

    if (!force && booking.confirmationEmailSent && to === booking.user.email) {
        return booking;
    }

    await sendEmail({
        to,
        subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
        body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
               <h2>Hi ${booking.user.name},</h2>
               <p>Your booking for <strong style="color: #F84565;">"${booking.show.movie.title}"</strong> is confirmed.</p>
               <p>
               <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}<br/>
               <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
               </p>
               <p><strong>Seats:</strong> ${booking.bookedSeats.join(", ")}</p>
               <p>Enjoy the show!</p>
               <p>Thanks for booking with us!<br/>QuickShow Team</p>
               </div>`
    });

    if (to === booking.user.email && !booking.confirmationEmailSent) {
        booking.confirmationEmailSent = true;
        await booking.save();
    }

    return booking;
};
