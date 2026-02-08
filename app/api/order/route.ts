const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import serverCatchError from "@/lib/serverCatchError";
mongoose.connect(db)

export const POST = async(req:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"},{status:401})
        }
        const body = await req.json()
        body.user = session.user.id
        const orders = await OrderModel.create(body)
        return res.json(orders)
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

        let orders = []
        const role = session.user.role
        const userId = session.user.id

        if(role === "user"){
            orders = await OrderModel.find({user: userId}).sort({createdAt:-1}).populate("products")
        }

        if(role === "admin"){
            orders = await OrderModel.find().sort({createdAt:-1}).populate("user","fullname email mobile").populate("products")
        }

        return res.json(orders)
        
    } catch (err) {
        return serverCatchError(err)
    }
}