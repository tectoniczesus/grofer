import cloudinary from "../config/cloudinary.js";
import Product from "../models/products.models.js";
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
    const{name,description,price,stock,category} = req.body;
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
    const uploadPromises = req.file.map((file)=>{
        return cloudinary.uploader.upload(file.path,{
            folder:"products",
        });
    });
    const uploadResults = await Promise.all(uploadPromises);
    product.images = uploadPromises.map((result)=>result.secure_url);
   }
     await product.save();
    res.status(200).json(product);
} catch (error) {
    console.error("Error in updating product:",error);
    res.status(500).json({message:"Internal server error"});
}
}