// add product to user cart

import userModel from "../models/userModel.js"

const addToCart=async(req,res)=>
{
    try{

        const userId = req.user.id; 
        const {itemId,size}=req.body

        const userData=await userModel.findById(userId)

        let cartData=await userData.cartData;

        if(cartData[itemId])
        {
            if(cartData[itemId][size])
            {
                cartData[itemId][size]+=1
            }else
            {
                cartData[itemId][size]=1
            }
        }else
        {
            cartData[itemId]={}
            cartData[itemId][size]=1
        }
        await userModel.findByIdAndUpdate(userId,{cartData})

        res.json({success:true,Message:"Added to cart"})
    }
    catch(error){

        console.log(error)
        res.json({success:false,message:error.message})

    }
}


// update user cart
const updateCart=async(req,res)=>
{
    try{

        const userId = req.user.id; 
        const {itemId,size,quantity}=req.body

        const userData=await userModel.findById(userId)

        let cartData=await userData.cartData;

        cartData[itemId][size]=quantity

        await userModel.findByIdAndUpdate(userId,{cartData})
        res.json({success:true,Message:"cart updated"})
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

// get user cart data
const getUserCart=async(req,res)=>
{
    try{
        
        const userId = req.user.id; 
        const userData=await userModel.findById(userId).populate('cartData');

        if(!userData)
        {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData=await userData.cartData;

        res.json({success:true,cartData})

    }catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


export {addToCart,updateCart,getUserCart}