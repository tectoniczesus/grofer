import User from "../models/user.models.js";
import {Review} from "../models/review.models.js";
import {Product} from "../models/products.models.js";
export async function createOrder(req,res){
try {
    const user = req.user;
    const {orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
    if(!orderItems || orderItems.length === 0){
        return res.status(400).json({error:"no order found"});
    }
    for (const items of orderItems){
        const product = await Product.findById(items.product._id);
        if(!product){
            return res.status(404).json({error:`Product ${items.name} not found`});
        }
        if(product.stock < items.quantity){
         res.status(400).json({error:`Insufficient stock for ${product.name}`});
        }

    }

    const order = await Order.create({
        user: user._id,
        clerkId: user.clerkId,
        orderItems,
        shippingAddress,
        paymentResult,
        totalPrice
    });
    for(const items of orderItems){
        await Product.findByIdAndUpdate(items.product._id,{
            $inc:{stock: -items.quantity},
        });
    }
    res.status(201).json({message:"Order created successfully",order});
} catch (error) {
    console.error("Error while creating order",error);
    res.status(500).json({error:"Internal server error"});
}
}
export async function getUserOrder(req,res){
try {
    const order = await Order.find({clerkId:req.user.clerkId}).populate("orderItems.product").sort({createAt:-1});
    const orderId = order.map((order)=> order._id);
    const reviews = await Review.find({orderId:{$in:orderId}});
    const reviewOrderIds = new Set(reviews.map((review)=> review.orderId.toString()));

    const orderWithReviewStatus = await Promise.all(
        orders.map(async (order)=>{
            return {
                ...order.toObject(),
                hasReviewed: reviewedOrderIds.has(order._id.toString()),
            };
        })
    );
    res.status(200).json({orders:orderWithReviewStatus});
} catch (error) {
    console.error("Error while fetching user orders",error);
    res.status(500).json({error:"Internal server error"});
}
}