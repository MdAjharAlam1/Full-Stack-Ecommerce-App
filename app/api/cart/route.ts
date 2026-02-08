const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import serverCatchError from "@/lib/serverCatchError";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db)

import { NextRequest , NextResponse as res} from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import CartModel from "@/models/cart.model";

export const POST = async(req:NextRequest)=>{
    try {

        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }

        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"}, {status:401})
        }
        
        const body = await req.json()
        body.user = session.user.id

        const isUpdated = await CartModel.findOneAndUpdate({user:body.user, product:body.product},{$inc:{quantity:1}},{new:true})
        if(isUpdated){
            return res.json(isUpdated)
        }
        const cart = await CartModel.create(body)
        return res.json(cart)
        
    } catch (err) {
        return serverCatchError(err)    
    }
}

export const GET = async(req:NextRequest)=>{
    try {

        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"},{status:401})
        }

        const {searchParams} = new URL(req.url)
        const count = searchParams.get('count')
        if(count){
            const count = await CartModel.countDocuments()
            return res.json({count})
        }
        const userId = session.user.id
        const carts = await CartModel.find({user:userId}).populate('product')
        return res.json(carts)
        
    } catch (err) {
        return serverCatchError(err)
    }
}