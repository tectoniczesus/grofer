import cloudinary from "../config/cloudinary.js";
import {Product} from "../models/products.models.js";
import {Order} from "../models/order.models.js";
import User from "../models/user.models.js";

export async function createProduct(req,res){
    try {
        const {name,description,price,stock,category} = req.body;
        if(!name||!description||!price||!stock||!category) {
            return res.status(400).json({message:"All fields are required"});
        }
        if(!req.files || req.files.length === 0){
            return res.status(400).json({message:"At least one image is required"});

        }
        if(req.files.length > 3){
            return res.status(400).json({message:"maximum 3 images are allowed"});
        }
        const uploadPromises = req.files.map((file)=>{
            return cloudinary.uploader.upload(file.path,{
                folder:"products",
            });
        })
        const uploadResults = await Promise.all(uploadPromises);
        const imgURL = uploadResults.map((result)=> result.secure_url);
        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imgURL,

        });
        res.status(200).json(product);
    } catch (error) {
        console.error("Error creating product:",error);
        res.status(500).json({message:"Internal server error"});
        
    }
}
export async function getAllProducts(_,res){
    try {
        const products = await Product.find().sort({createdAt:-1});
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in fetching products:",error);
        res.status(500).json({message:"Internal server error"});
    }
}
export async function updateProduct(req,res){
try {
    const{id} = req.params;
    const {
  name,
  description,
  price,
  stock,
  category
} = req.body || {};
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
        
    }
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = parseFloat(price);
    if(stock!==undefined) product.stock = parseInt(stock);
    if(category) product.category = category;
   if(req.files && req.files.length>0){
    if(req.files.length>3){
        return res.status(400).json({message:"maximum 3 images are allowed"});
    }
    const uploadPromises = req.files.map((file)=>{
        return cloudinary.uploader.upload(file.path,{
            folder:"products",
        });
    });
    const uploadResults = await Promise.all(uploadPromises);
    product.images = uploadResults.map((result)=>result.secure_url);
   }
   console.log("req.body:", req.body);
   console.log("req.files:", req.files);
     await product.save();
    res.status(200).json(product);
} catch (error) {
    console.error("Error in updating product:",error);
    res.status(500).json({message:"Internal server error"});
}
}

export async function getAllOrders(req,res) {
    try {
        const order = await Order.find().populate("user" ,"name email").populate("orderItems.product").sort({createAt:-1});
        res.status(200).json(order);
    } catch (error) {
        console.error("error in getting all orders",error);
        res.status(500).json({error:"Internal server error"});
    }
}

export async function updateOrderStatus(req,res){
    try {
        const{orderId} = req.params;
        const{status} = req.body;
        if(!["pending","shipped","delivered"].includes(status)){
            return res.status(400).json({message:"Invalid status value"});

        }
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.status = status;
        if(status=="shipped" && !order.shippedAt){
            order.shippedAt = new Date();
        }
        if(status=="delivered"&& !order.deliveredAt){
            order.deliveredAt = new Date();
        }
        await order.save();
        res.status(200).json({message:"Order status updated successfully",order});
    } catch (error) {
        console.error("Error in updating order status:",error);
        res.status(500).json({message:"Internal server error"});
    }

}


export async function getAllCustomers(_,res){
try {
    const customer = await User.find().sort({createdAt:-1});
    res.status(200).json(customer);
} catch (error) {
    console.error("Error in getting customers:",error);
    res.status(500).json({message:"Internal server error"});
}
}

export async function getDashboardStats(req,res){
try {
    const totalOrder = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
        {
            $group:{
                _id:null,
                total:{$sum:"$totalPrice"},
            },
        },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    res.status(200).json({
        totalCustomers,
        totalOrder,
        totalRevenue,
        totalProducts
    })
} catch (error) {
    console.error("Error in fetching dashboard stats:",error);
    res.status(500).json({message:"Internal server error"});
}
}

export const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
    const product = await Product.findById(id);
    if(!product) return res.status(404).json({error:"Product not found"});

    if(product.images && product.images.length > 0){
        const deletePromies = product.images.map((imageUrl)=>{
            const publicId = "products/" + imageUrl.split("/product/")[1]?.split(".")[0];
            if(publicId) return cloudinary.uploader.destroy(publicId);
        });
        await Promise.all(deletePromies.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({message:"Product deleted"});
    } catch (error) {
        console.error("Error while deleting the product",error);
        res.status(500).json({error:"Internal server error"});
    }
}