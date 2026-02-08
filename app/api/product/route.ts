const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import { v4 as uuid } from "uuid";
import ProductModel from "@/models/product.model";
import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/lib/serverCatchError";
import path from "path";
import fs from "fs"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const POST = async(req:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return res.json({message:"Unauthorized"},{status:401})
        }
        if(session.user.role !== "admin"){
            return res.json({message:"Unauthorized"},{status:401})
        }
        const body = await req.formData()
        const file = body.get('image') as File | null

        if(!file){
            return res.json({message:"Product image not sent"},{status:400})
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const root = process.cwd()
        const folder = path.join(root,"public","products")
        const fileName = `${uuid()}.png`
        const filePath = path.join(folder,fileName)

        fs.writeFileSync(filePath,buffer)

        const imageUrl = `/products/${fileName}`;

        const payload = {
            title: body.get('title'),
            description: body.get('description'),
            price: body.get('price'),
            discount: body.get('discount'),
            stock: body.get('stock'),
            image: imageUrl
        }
        const product = await ProductModel.create(payload)
        
        return res.json(product)
        
    } catch (err) {
        return serverCatchError(err)
    }
}

export const GET = async(req:NextRequest)=>{
    try {
        const {searchParams}  = new URL(req.url)
        const slug = searchParams.get("slug")
        const search = searchParams.get('search')
        const limit = Number(searchParams.get('limit')) || 16
        const page = Number(searchParams.get('page')) || 1
        
        const skip = (page-1)*limit
        const total = await ProductModel.countDocuments()
        if(search){
            const product = await ProductModel.find({title: RegExp(search, 'i')}).sort({createdAt:-1}).skip(skip).limit(limit)
            return res.json({data:product,total:total})
        }

        if(slug){
            const slugs = await ProductModel.distinct('slug')
            return res.json(slugs)
        }
        
        const products = await ProductModel.find().sort({createdAt:-1}).skip(skip).limit(limit)
        return res.json({total,data:products})
    }
    catch(err)
    {
        return serverCatchError(err)

    }
}