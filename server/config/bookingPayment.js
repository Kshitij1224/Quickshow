import Booking from "../models/Booking.js";

export const markBookingPaid = async (bookingId) => {
    if (!bookingId) {
        throw new Error("Missing bookingId");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error(`Booking not found for id ${bookingId}`);
    }

    if (!booking.isPaid) {
        booking.isPaid = true;
        booking.paymentLink = "";
        await booking.save();
    }

    return booking;
};
