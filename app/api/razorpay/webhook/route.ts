import { NextRequest, NextResponse as res } from "next/server";
import fs from "fs"

import crypto from "crypto"
import OrderModel from "@/models/order.model";
import path from "path"
import moment from "moment";
import PaymentModel from "@/models/payment.model";
import CartModel from "@/models/cart.model";
import serverCatchError from "@/lib/serverCatchError";

const root = process.cwd()

interface OrderInterface {
    user:string,
    products: string[],
    prices: string[],
    discounts : string[]
}

interface PaymentInterface {
    user:string,
    order:string,
    paymentId:string,
    vendor?: "razorpay" | "stripe"
}

interface DeleteCartInterface {
    user:string,
    products:string[]
}

const createLogs = (err:unknown , service:string)=>{
    if(err instanceof Error)
    {   
        // console.log(err.message, service)
        const dateTime = moment().format('DD-MM-YYYY_hh-mm-ss_A')
        const filePath = path.join(root, "logs", `${service}-error-${dateTime}.txt`)
        fs.writeFileSync(filePath,err.message)
        return false
        
    }
}

const createOrder = async(order: OrderInterface)=>{
    try {
        const {_id} = await OrderModel.create(order)
        return _id
        
    } catch (err) {
        // console.log(err)
        return createLogs(err, 'Order')
    }
}

const createPayment = async(payload:PaymentInterface)=>{
    try {
        await PaymentModel.create(payload)
        return true
        
    } catch (err) {
       return createLogs(err,'Payment')
    }
}

const deleteCarts = async(carts:DeleteCartInterface)=>{
    try {
        const query = carts.products.map((id)=>({user:carts.user, product:id}))
        console.log(query)
        await CartModel.deleteMany({
            $or: query
        })
        return true
    } catch (err) {
     return createLogs(err, "Delete-Carts")   
    }
}

export const POST = async(req:NextRequest)=>{
    try {
        const signature = req.headers.get('x-razorpay-signature')

        const body = await req.json()
        const mySignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!).update(JSON.stringify(body)).digest('hex')
        const paymentEntity = body.payload?.payment?.entity;
        if (!paymentEntity) {
            return res.json({ message: "No payment entity found" }, { status: 400 });
        }

        const user = paymentEntity.notes?.user;
        const orders = JSON.parse(paymentEntity.notes?.orders || "[]");

            
        if(signature !== mySignature){
            return res.json({message:"Invalid Signature"},{status:400})
        }
        
        if(body.event === "payment.authorized" && process.env.NODE_ENV === "development"){
            
            const orderId = await createOrder({user, ...orders})
            // console.log(orderId)
            if(!orderId){
                // console.log(orderId,"order")
                return res.json({message:"Failed to create order"},{status:424})
            }
            const payment = await createPayment({user:user, order:orderId, paymentId:paymentEntity.id})
            if(!payment){
                // console.log(payment, "payment")
                return res.json({message:"Failed to create payment"},{status:424})
            }
            await deleteCarts({user, products:orders.products})
        }
        if(body.event === "payment.captured" && process.env.NODE_ENV === "production"){
            console.log("payment sucess")
        }

        if(body.event === "payment.failed"){
            console.log("Payment Failed")
        }

        return res.json({success:true})
        
    } catch (err:unknown) {
        if(err instanceof Error){
            console.log(err.message)
            return serverCatchError(err)

        }
    }
}