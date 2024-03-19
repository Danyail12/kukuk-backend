import stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config({
    path:"./config/config.env",
});

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async(req,res)=>{
    

    const {products} = req.body;


    const lineItems = products.map((product)=>({
        price_data:{
            currency:"EUR",
            product_data:{
                name:product.username,
                images:[product.imgdata]
            },
            unit_amount:product.feesPerConsaltation * 100,
        },
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        // success_url:"http://localhost:3000/sucess",
        // cancel_url:"http://localhost:3000/cancel",
    });

    res.json({id:session.id,
    data:session
    })

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