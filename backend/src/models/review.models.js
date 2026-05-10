import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
     productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
     }
},{timestamps:true});

export const Review  = mongoose.model('Review',reviewSchema);