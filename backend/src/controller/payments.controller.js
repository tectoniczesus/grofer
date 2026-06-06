import Stripe from "stripe"
import { ENV } from "../config/env.js"
import User from "../models/user.models.js"
import { Product } from "../models/products.models.js"
import { Order } from "../models/order.models.js"
import { Cart } from "../models/cart.models.js"
import { err } from "inngest/types"

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
const MAX_METADATA_PRODUCT_IDS = 10;
const MAX_METADATA_VALUE_LENGTH = 500;

function toMetadataValue(value) {
    return String(value ?? "").slice(0, MAX_METADATA_VALUE_LENGTH);
}

export async function createPaymentIntent(req,res) {
    try {
        const {cartItems, shippingAddress} = req.body;
        const user = req.user;

        if (!Array.isArray(cartItems) || cartItems.length === 0 || !shippingAddress) {
            return res.status(400).json({error:"Cart is empty"});
        }
        let subtotal = 0;
        const validatedItems = [];
        for(const items of cartItems){
            const product = await Product.findById(items.product._id);
            if(!product) return res.status(404).json({error:`Product ${items.product.name} not found`});

            if(product.stock < items.quantity){
                return res.status(400).json({error:`Insufficient stock for ${product.name}`});
            }

            subtotal += product.price * items.quantity;
            validatedItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: items.quantity,
                image: product.images[0],
            })
        }
        const shipping = 10.0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if(total<=0) return res.status(400).json({error:"Invalid order total"});

        let customer;
        if(user.stripeCustomerId){
            customer = await stripe.customers.retrieve(user.stripeCustomerId);

        }else{
            customer = await stripe.customers.create({
                email:user.email,
                name: user.name,
                metadata:{
                    clerkId: user.clerkID,
                    userId: user._id.toString(),
                },
            });
            await User.findByIdAndUpdate(user._id,{stripeCustomerId:customer.id});
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency:"usd",
            customer:customer.id,
            automatic_payment_methods:{
                enabled:true,
            },
             metadata: {
        clerkId: user.clerkID,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },


        });
        res.status(200).json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
        console.log("Error creating payment intent",error);
        res.status(500).json({error:"Internal server error"});
        
    }
}

export async function handleWebhook(req,res) {
    console.log("HANDLE WEBHOOK STARTED");
    const sig = req.headers["stripe-signature"];
    console.log("Stripe Signature:", !!sig);
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Webhook signature verification failed",error.message);
        return res.status(400).json(`Webhook Error: ${error.message}`);   
    }
    if(event.type === "payment_intent.succeeded"){
        const paymentIntent = event.data.object;
        console.log("Payment succeeded", paymentIntent.id);
        try {
            const{userId,clerkID,orderItems,shippingAddress,totalPrice}=paymentIntent.metadata;
            //checking if order already exit or not
            const exitingOrder = await Order.findOne({"paymentResult.id":paymentIntent.id})
            if(exitingOrder){
                console.log("Order already exits for payments:",paymentIntent.id);
                return res.json({received:true})
            }
            //if not than create order
            const order = await Order.create({
                user:userId,
                clerkId,
                orderItems:JSON.parse(orderItems),
                shippingAddress:JSON.parse(shippingAddress),
                paymentResult:{
                    id:paymentIntent.id,
                    status:"succeeded",
                },
                totalPrice:parseFloat(totalPrice),
            });
            //update product stock
            const items = JSON.parse(orderItems);
            for(const item of items){
                await Product.findByIdAndUpdate(item.product,{
                    $inc:{stock:-item.quantity},
                });
            }
            //getting the webhooks from stripe
        } catch (error) {
            console.error("Error processing webhook", error);
            console.log("error",Error);
            
        }
        

    }
    console.log("Webhook hit");
    console.log(req.originalUrl);
    console.log(req.headers);

    res.json({received:true});
}
