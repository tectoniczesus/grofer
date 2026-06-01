import { Cart } from "../models/cart.models.js";
import { Product } from "../models/products.models.js";
export async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ clerkId: req.user.clerkID }).populate(
      "items.product",
    );

    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkID,
        items: [],
      });
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error while creating cart", error);
    res.status(500).json({ error: "internal server error" });
  }
}
export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    let cart = await Cart.findOne({ clerkId: req.user.clerkID });
    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkID,
        items: [],
      });
    }
    const existingItem = cart.items.find(
      (items) => items.product.toString() === productId,
    );
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error while adding to  cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateCart(req, res) {
  try {
    const { productId } = req.params;
  const { quantity } = req.body;
  if (quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }
  const cart = await Cart.findOne({clerkId:req.user.clerkID});
  if(!cart){
    return res.status(404).json({error:"Cart not found"});
  }
  const itemIndex = cart.items.findIndex((item)=> item.product.toString()===productId);
  if(itemIndex === -1){
    return res.status(404).json({error:"Item not found in cart"});
  }
  const product = await Product.findById(productId);
  if(!product){
    return res.status(404).json({error:"Product not found"});
  }
  if(product.stock < quantity){
    return res.status(400).json({error:"Insufficient quantity"});
  }
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  res.status(200).json({message:"cart updated successfully",cart});
  } catch (error) {
    console.error("Error while updating cart",error);
    res.status(500).json({error:"Internal server error"});
  }
}
export async function removeFromCart(req, res) {
    try {
        const {productId} = req.params;
        const cart = await Cart.findOne({clerkId:req.user.clerkID});
        if(!cart){
            return res.status(404).json({error:"Cart not found"});
        }
        cart.items = cart.items.filter((item)=> item.product.toString()!== productId);
        await cart.save();
        res.status(200).json({message:"item removed from cart",cart});

    } catch (error) {
        console.error("Error while removing from cart",error);
        res.status(500).json({error:"Internal server error"});
    }
}
export async function clearCart(req, res) {
  try {
      const cart = await Cart.findOne({clerkId: req.user.clerkID});
  if(!cart){
    return res.status(404).json({error:"Cart not found"});
  }

  cart.items = [];
  await cart.save();
  res.status(200).json({message:"Cart cleared successfully",cart});
  } catch (error) {
    console.error("Error while clearing cart",error);
    res.status(500).json({error:"Internal server error"});
  }
}
