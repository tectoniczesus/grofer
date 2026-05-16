import {Product} from "../models/products.models.js";
export async function getProductById(req,res){
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({error:"product not found"});
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by Id",error);
    res.status(400).json({error:"something went wrong"});
  }
}