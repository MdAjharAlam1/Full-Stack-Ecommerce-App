const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import serverCatchError from "@/lib/serverCatchError";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
mongoose.connect(db)

import Razorpay from "razorpay";
import { authOptions } from "../../auth/[...nextauth]/route";

const rozarpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

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
        const payload = {
            amount: Number(body.amount) * 100,
            currency: process.env.CURRENCY!
        }
        
        const order = await rozarpay.orders.create(payload)
        return res.json(order)
    } catch (err) {
        return serverCatchError(err)
    }
}
