const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/serverCatchError";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res} from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import IdInterface from "@/interface/id.interface";
import CartModel from "@/models/cart.model";

export const PUT = async(req:NextRequest,context:IdInterface)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }

        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"},{status:401})
        }

        const body = await req.json()
        const {id} = await context.params

        let carts = null

        if(body.quantity > 0){
            carts = await CartModel.findByIdAndUpdate(id,{quantity:body.quantity},{new:true})
        }
        else{
            carts = await CartModel.findByIdAndDelete(id)
        }
        
        if(!carts){
            return res.json({message:"Cart  not found"},{status:404})
        }
        return res.json(carts)

        
    } catch (err) {
        return serverCatchError(err)
    }
}

export const DELETE = async(req:NextRequest,context:IdInterface)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"},{status:401})
        }

        const {id} = await context.params
        const cart = await CartModel.findByIdAndDelete(id)
        if(!cart){
            return res.json({message:"cart not found"})
        }

        return res.json(cart)

        
    } catch (err) {
        return serverCatchError(err)
    }
}