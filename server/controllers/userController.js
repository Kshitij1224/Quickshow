import { logLevels } from "inngest/types";
import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";
import { sendBookingConfirmationEmail } from "../config/bookingConfirmationEmail.js";

export const getUserBookings = async(req,res)=>{
    try {
        const user = await req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1});
        console.log("Bookings with show data:", bookings); 
        res.json({success: true,bookings})
    } catch (error) {
        console.error(error.message);
        res.json({success: false,message: error.message});
    }
}

export const updateFavorite = async(req,res)=>{
    try {
        const {movieId} = req.body;
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);
        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites=[]
        }
        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites=user.privateMetadata.favorites.filter(item=>item!==movieId)
        }
        await clerkClient.users.updateUserMetadata(userId,{privateMetadata: user.privateMetadata})
        res.json({success: true,message: "Favorite movies updated."}) 
    } catch (error) {
        console.error(error.message);
        res.json({success: false,message: error.message});
    }
}  

export const getFavorites = async(req,res)=>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;
        const movies = await Movie.find({_id: {$in: favorites}})
        res.json({success: true,movies})
    } catch (error) {
        console.error(error.message);
        res.json({success: false,message: error.message});
    }
}

export const resendBookingConfirmationEmail = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.json({ success: false, message: "bookingId is required" });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user !== userId) {
            return res.json({ success: false, message: "Not authorized for this booking" });
        }

        await sendBookingConfirmationEmail(bookingId);

        res.json({ success: true, message: "Confirmation email sent." });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}
