import serverCatchError from "@/lib/serverCatchError";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import UserModel from "@/models/user.model";

export const GET = async(req:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"}, {status:401})
        }
        if(session.user.role !== "admin"){
            return res.json({message:"Unauthorized"}, {status:401})
        }

        const {searchParams} = new URL(req.url)
        const limit = Number(searchParams.get('limit')) || 16
        const page = Number(searchParams.get('page')) || 1
        const search = searchParams.get('search')
        
        const total = await UserModel.countDocuments()
        const skip = (page-1) * limit

        if(search){
            const users = await UserModel.find({role:"user",fullname: RegExp(search,"i")}).sort({createdAt:-1}).skip(skip).limit(limit)
            return res.json({data:users, total:total})
        }
        const users = await UserModel.find({role:"user"},{password:0}).sort({createdAt:-1}).skip(skip).limit(limit)
        return res.json({data:users,total:total})
    } catch (err) {
        return serverCatchError(err)
    }
}