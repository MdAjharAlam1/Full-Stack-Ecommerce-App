const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import ProductModel from '@/models/product.model'
import {NextRequest ,NextResponse as res } from 'next/server'
import serverCatchError from '@/lib/serverCatchError'
import SlugInterface from '@/interface/slug.interface'
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async(req:NextRequest,context:SlugInterface)=>{
    try {
        const {slug} = await context.params
        // console.log(slug)
        const product = await ProductModel.findOne({slug})
        if(!product){
            return res.json({message:"Product not found with this slug"},{status:404})
        }
        return res.json(product)
    } catch (err) {
        return serverCatchError(err)
    }
}

export const PUT = async(req:NextRequest,context:SlugInterface)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "admin"){
            return res.json({message:"Unauthorized"},{status:401})
        }
        const{slug:id} = await context.params
        const body = await req.json()
        const product = await ProductModel.findByIdAndUpdate(id,body,{new:true})
        return res.json(product)

    } catch (err) {
        return serverCatchError(err)
    }
}

export const DELETE = async(req:NextRequest,context:SlugInterface)=>{
    try {

        const {slug:id} = await context.params
        const product = await ProductModel.findByIdAndDelete(id)
        return res.json(product)
        
    } catch (err) {
        return serverCatchError(err)
    }
}