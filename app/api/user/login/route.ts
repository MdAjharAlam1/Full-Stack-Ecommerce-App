const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import UserModel from "@/models/user.model";
import { NextRequest,NextResponse as res } from "next/server";
import bcrypt from "bcrypt"
import serverCatchError from "@/lib/serverCatchError";

export const POST = async(req:NextRequest)=>{
    try {
        const{email,password,provider} = await req.json()
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({message:"User not Found"},{status:404})
        }
        // console.log(user)
        const payload = {
            id : user._id,
            name: user.fullname,
            email:user.email,
            role : user.role,
            address:user.address,
            mobile: user.mobile
        }
        // console.log(payload)
        if(provider === "google"){
            return res.json(payload)
        }

        const isLogin = await bcrypt.compare(password,user.password)
        if(!isLogin){
            return res.json({message:"Invalid Credential"},{status:401})
        }
        // console.log(payload)
        return res.json(payload)
    } 
    catch (err) {
        return serverCatchError(err)
    }
}