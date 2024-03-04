import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({
    path: "./config/config.env",
});

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);
export const createCustomer = async(req,res)=>{

    try {

        const customer = await stripe.customers.create({
            name:req.body.name,
            email:req.body.email,
        });

        res.status(200).send(customer);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

export const addNewCard = async(req,res)=>{

    try {

        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card:{
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });

        res.status(200).send({ card: card.id });

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

export const createCharges = async(req,res)=>{

    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'tester@gmail.com',
            amount: parseInt(req.body.amount)*100, //amount*100
            currency:'EUR',
            card: req.body.card_id,
            customer: req.body.customer_id
        });

        res.status(200).send(createCharge);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}


export const subscriberForMonth = async(req,res)=>{
    try {
        const { customerId, priceId } = req.body;
    
        // Create a subscription
        const subscription = await stripeClient.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          billing_cycle_anchor: 'now',
        });
    
        res.status(200).json({ success: true, subscription });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create subscription', error: error.message });
      }
}


export const subscriberForYear = async(req,res)=>{
    try {
        const { customerId, priceId } = req.body;
    
        // Create a subscription
        const subscription = await stripeClient.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          billing_cycle_anchor: 'now',
          billing_cycle_interval: 'year',
        });
    
        res.status(200).json({ success: true, subscription });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create subscription', error: error.message });
      }
}