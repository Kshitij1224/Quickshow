import express from "express"
import { getFavorites, getUserBookings, resendBookingConfirmationEmail, updateFavorite } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings',getUserBookings)
userRouter.post('/update-favorite',updateFavorite)
userRouter.get('/favorites',getFavorites)
userRouter.post('/resend-booking-email',resendBookingConfirmationEmail)

export default userRouter;
