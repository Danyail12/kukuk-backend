import express from "express";
import stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config({
    path:"./config/config.env",
});

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", isAuthenticated, async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "EUR",
                product_data: {
                    name: product.username,
                    images: [product.imgdata]
                },
                unit_amount: product.feesPerConsaltation * 100,
            },
            quantity: product.qnty
        }));

        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

export default router;
