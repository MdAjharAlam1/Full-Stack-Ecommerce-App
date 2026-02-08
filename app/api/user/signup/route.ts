const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/serverCatchError";
import UserModel from "@/models/user.model";
import { NextRequest,NextResponse as res } from "next/server";

export const POST = async(req:NextRequest)=>{
    try {
        const body = await req.json()
        await UserModel.create(body)
        return res.json({message:"Signup Success"})
    } catch (err) {
        return serverCatchError(err)
    }
}