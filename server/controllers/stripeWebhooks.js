import stripe from "stripe";
import { sendBookingConfirmationEmail } from "../config/bookingConfirmationEmail.js";
import { markBookingPaid } from "../config/bookingPayment.js";

const getBookingIdFromEvent = async (stripeInstance, event) => {
    if (event.type === "checkout.session.completed") {
        return event.data.object.metadata?.bookingId;
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id
        });
        return sessionList.data[0]?.metadata?.bookingId;
    }

    return null;
};

export const stripeWebhooks = async(req,res)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"]; 

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
     
    try {
        console.log("Stripe webhook event:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                const bookingId = await getBookingIdFromEvent(stripeInstance, event);
                await markBookingPaid(bookingId);
                await sendBookingConfirmationEmail(bookingId);
                break;
            }
            case "payment_intent.succeeded":{
                const bookingId = await getBookingIdFromEvent(stripeInstance, event);
                await markBookingPaid(bookingId);
                await sendBookingConfirmationEmail(bookingId);
                break;
            }
                 
            default:
                console.log("Unhandled event type:",event.type)
        }
        res.json({received: true})
    } catch (err) {
        console.error("Webhook processing error:",err);
        res.status(500).send("Internal Server Error");
    }
}
