import {Product }from "../models/products.models.js";
import {Review} from "../models/review.models.js";
import {Order} from "../models/order.models.js";


export async function createReview(req,res){
try {
    const {productId, rating,orderId} = req.body;
if(!rating || rating<1 || rating>5){
    return res.status(400).json({error:"Rating must be between 1 and 5"});
}
const user = req.user;
const order = await Order.findById(orderId);
if(!order){
    return res.status(404).json({error:"Order not found"});
}
   if(order.clerkId !== user.clerkID){
    return res.status(403).json({error:"Not authorized to review this order"});
   }
   if(order.status !=="delivered"){
    return res.status(400).json({error:"Can only review delivered order"});
   }
   const productInOrder = order.orderItems.find(
    (items)=> items.product.toString() === productId.toString()
   );
   if(!productInOrder){
    return res.status(400).json({error:"Product not found in order"});
   }
   const review = await Review.findOneAndUpdate(
    {productId,userId:user._id},
    {rating,orderId,productId,userId:user._id},
    {new:true,upsert:true,runValidators:true}
   ); 
   console.log("user id->",user._id);
   console.log("review from controller->", review);
   
   
   //new to update review, upsert to update or create one if not exit, validator to validate true one
   const reviews = await Review.find({productId});
   const totalRating = reviews.reduce((sum,rev)=> sum + rev.rating,0);
   const updateProduct = await Product.findByIdAndUpdate(
    productId,
    {averageRating: totalRating / reviews.length,
    totalReviews:reviews.length,
    },
    {new:true, runValidators:true}
   );

   if(!updateProduct){
    await Review.findByIdAndDelete(review._id);
    return res.status(404).json({error:"Product not found"});
   }
   res.status(201).json({message:"Review submitted successfully",review});
} catch (error) {
    console.error("Error while creating review",error);
    res.status(500).json({error:"Internal server error"});
}
}
export async function deleteReview(req,res){
try {
     const {reviewId }= req.params;
    const user = req.user;
    const review =await Review.findById(reviewId);
    if(!review){
        return res.status(404).json({error:"Review not found"});
    }
    if(review.userId.toString()!==user._id.toString()){
        return res.status(403).json({error:"Not authorized to delete this review"});
    }
    const productId = review.productId;
    await Review.findByIdAndDelete(productId);
    const reviews = await Review.find({productId});
    const totalRating = reviews.reduce((sum,rev)=>sum + rev.rating,0);
    await Product.findByIdAndUpdate(
        productId,
        {
            averageRating:reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews:reviews.length,
        });
        res.status(200).json({message:"Review deleted successfully"});

} catch (error) {
    console.error("Error while deleting review",error);
    res.status(500).json({error:"Internal server error"});
}
}
