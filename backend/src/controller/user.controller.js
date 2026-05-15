import User from "../models/user.models.js"
export async function addAddress(req,res){
try {
    const {label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault}  = req.body;
    const user = req.user;
    if(!fullName || !streetAddress || !city || !state || !zipCode){
        return res.status(400).json({message:"required fields are missing"});
    }
    //If a new address is being marked as default
    //then all existing addresses of that user are changed to non-default
    //so that only one address remains default
    if(isDefault){
        user.addresses.forEach((addr)=>{
            addr.isDefault = false;
        })
    }
    user.addresses.push({
        label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault:isDefault || false
    });
    await user.save();
    res.status(201).json({message:"address added successfully",address:user.addresses});
} catch (error) {
    console.error("Error adding address",error);
    res.status(500).json({error:"internal server error"});
}
}
export async function getAddress(req,res){
    try {
        const user = req.user;
        res.status(200).json({address:user.addresses});
    } catch (error) {
        console.error("Error fetching user address",error);
        res.status(500).json({error:"internal server error"});
    }
}
export async function updateAddress(req,res){
    try {
        const {label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault}  = req.body;
        const {addressId} = req.params;

        const user = req.user;
        const address = user.addresses.id(addressId);
        if(!address){
            return res.status(404).json({message:"address not found"});
        }
        if(isDefault){
            user.addresses.forEach((addr)=>{
                addr.isDefault = false;
            });
        }
        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.status(200).json({message:"address updated successfully",address:user.addresses});
    } catch (error) {
        console.error("Error updating address",error);
        res.status(500).json({error:"internal server error"});
    }
}
export async function deleteAddress(req,res){
    try {
        const{addressId} = req.params;
        const user = req.user;
        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({message:"address deleted successfully",address:user.addresses});
    } catch (error) {
        console.error("Error deleting address",error);
        res.status(500).json({error:"internal server error"});
    }
}
export async function addToWishlist(req,res){
    try {
        const{productId} = req.body;
        const user = req.user;
        if(user.wishlist.includes(productId)){
            return res.status(400).json({message:"product already in wishlist"});
        }
        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({message:"product added to wishlist",wishlist:user.wishlist});
    } catch (error) {
        console.error("Error adding product to wishlist",error);
        res.status(500).json({error:"internal server error"});
    }
}
export async function removeFromWishlist(req,res){
    try {
        const{productId} = req.params;
        const user = req.user;
        if(!user.wishlist.includes(productId)){
            return res.status(400).json({message:"product not found in wishlist"});
        }
        user.wishlist.pull(productId);
        await user.save();
        res.status(200).json({message:"product removed from wishlist",wishlist:user.wishlist});
    } catch (error) {
        console.error("Error in removing wishlist ",error);
        res.status(500).json({error:"internal server error"});
        
    }
}

export async function getWishlist(req,res){
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json({wishlist:user.wishlist});
    } catch (error) {
        console.error("Error in fetching wishlist",error);
        res.status(500).json({error:"internal server error"});
    }
}