const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import serverCatchError from "@/lib/serverCatchError";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db)
import { NextRequest,NextResponse as res, userAgent } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserModel from "@/models/user.model";


export const GET = async(req:NextRequest)=>{
    try {

        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:'Unauthorized'},{status:401})
        }
        if(session.user.role !== "user"){
            return res.json({message:'Unauthorized'},{status:401})
        }
        const userId = session.user.id
        const user = await UserModel.findById(userId).select('-password')
        if(!user){
            return res.json({message:"User data not found"},{status:404})
        }
        return res.json(user)
        
    } catch (err) {
        return serverCatchError(err)
    }
}

export const PUT = async(req:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "user"){
            return res.json({message:"Unauthorized"},{status:401})
        }
        const userId = session.user.id
        const {address,userData} = await req.json()

        console.log(userData)
        
        if(address){
            const user = await UserModel.findByIdAndUpdate(userId, {address},{new:true}).select('-password')
            if(!user){
                return res.json({message:"User data not found"},{status:404})
            }
            return res.json(user)
        }

        if(userData){
            const user = await UserModel.findByIdAndUpdate(userId, 
                {
                    fullname: userData.fullname,
                    phone: userData.phone,
                    address: {
                      street: userData.address.street,
                      city: userData.address.city,
                      state: userData.address.state,
                      country: userData.address.country,
                      pincode: userData.address.pincode
                    }
                },
                {new:true})
                .select('-password')
            if(!user){
                return res.json({message:"User data not found"},{status:404})
            }
            return res.json(user)
        }
        

    } catch (err) {
        return serverCatchError(err)
    }
}