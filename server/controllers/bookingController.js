import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import stripe from 'stripe'
import { markBookingPaid } from "../config/bookingPayment.js";
import { sendBookingConfirmationEmail } from "../config/bookingConfirmationEmail.js";

const checkSeatsAvailability = async(showId, selectedSeats) => {
    try {
        console.log(showId);
        
        const showData = await Show.findById(showId);
        if(!showData) return false;
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async(req,res) => {
    try {
        const {userId} = req.auth();
        console.log(userId);
        const {showId,selectedSeats} = req.body;
        const {origin} = req.headers;
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        const showData = await Show.findById(showId).populate('movie');
        console.log("SHOW DATA:", showData);
        
        // Get user data separately to ensure it exists
        const user = await User.findById(userId);
        console.log("USER DATA:", user);
        
        if (!user) {
            console.error("USER NOT FOUND for ID:", userId);
            return res.json({success: false, message: "User not found"});
        }
        
        const booking = await Booking.create({
            user: userId,
            show: new mongoose.Types.ObjectId(showId), // Store show ID as string
            amount: showData.showPrice*selectedSeats.length,
            bookedSeats: selectedSeats
        })
        
        console.log("BOOKING CREATED:", booking);
        
        // Manually set populated data to ensure it's available
        booking.user = user;
        // booking.show = showData;
        
        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat]=userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();
        
        console.log("SHOW DATA UPDATED:", showData);

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        const line_items=[{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount)*100
            },
            quantity: 1
        }]
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now()/1000)+30*60,
        })

        booking.paymentLink = session.url
        await booking.save()

        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({success: true,url: session.url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})  
    }
}

export const getOccupiedSeats = async(req,res)=>{
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({success: true, occupiedSeats})
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})  
    }
}

export const confirmBookingPayment = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.json({ success: false, message: "sessionId is required" });
        }

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
            return res.json({ success: false, message: "Booking metadata not found in Stripe session" });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user !== userId) {
            return res.json({ success: false, message: "Not authorized for this booking" });
        }

        if (session.payment_status !== "paid") {
            return res.json({ success: false, message: "Payment is not completed yet" });
        }

        await markBookingPaid(bookingId);
        await sendBookingConfirmationEmail(bookingId);

        res.json({ success: true, message: "Booking confirmed successfully", bookingId });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
