import Stripe from "stripe"
import { ENV } from "../config/env.js"
import User from "../models/user.models.js"
import { Product } from "../models/products.models.js"
import { Order } from "../models/order.models.js"
import { Cart } from "../models/cart.models.js"

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req,res) {
    try {
        const {cartItems, shippingAddress} = req.body;
        const user = req.user;

        if (!cartItems || !shippingAddress) {
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
            await User.findByIdAndUpdate(user._id,{stripeCustomerId:customer._id});
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency:"usd",
            customer:customer.id,
            automatic_payment_methods:{
                enabled:true,
            },
            metadata:{
                clerkId:user.clerkID,
                userId:user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress:JSON.stringify(shippingAddress),
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
    
}