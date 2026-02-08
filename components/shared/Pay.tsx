"use client"
import clientCatchError from '@/lib/clientCatchError'
import { Button, Modal, Result } from 'antd'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { useRazorpay,RazorpayOrderOptions } from 'react-razorpay'


interface PaymentSucessInterface{
    razorpay_order_id: string
    razorpay_payment_id : string
    razorpay_signature : string
}

interface PaymentFailedInterface{
    reason:string
    payment_id:string
    order_id : string
}

interface PayInterface {
    title:string,
    theme?: "Sad" | "Happy"
    data:any, 
    total:number,
    onSucess?:(payload:PaymentSucessInterface)=>void,
    onFailed?:(payload:PaymentFailedInterface)=>void
}


interface ModifiedRazopayOrderOptions extends RazorpayOrderOptions{
    notes:any
}


const Pay : FC<PayInterface> = ({data,total,onSucess,onFailed,title="Pay Now",theme}) => {
    const[open,setOpen] = useState(false)
    const session = useSession()
    const {Razorpay} = useRazorpay()
    const isArr = Array.isArray(data)
   
    const getOrderPayload = ()=>{
        const products = []
        const discounts = []
        const prices = []
        const quantitys = []
        
        if(!isArr){
            return{
                products:[data._id],
                prices:[data.price],
                discounts:[data.discount],
                quantitys:[1]
            }
        }
        for(let item of data){
            products.push(item.product._id)
            prices.push(item.product.price)
            discounts.push(item.product.discount)
            quantitys.push(item.quantity)
        }
        return {
            products,
            prices,
            discounts,
            quantitys
        }
    }

    const handleSuccess = (payload:any)=>{
        if(onSucess)
            return onSucess(payload)
        
        return null
    }
    

    const payNow = async(amount:number)=>{
        try {

            if(!session.data){
                throw new Error('Session not Intialized Yet !')
            }

            const {data} = await axios.post('/api/razorpay/order', {amount:amount})
            console.log(data)

            const options : ModifiedRazopayOrderOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                name:"Ecom Shops",
                description:"Bulk Product",
                amount: data.amount,
                currency:data.currency,
                order_id: data.id,
                prefill:{
                    name: session.data?.user.name as string,
                    email: session.data?.user.email as string
                },
                notes:{
                    name: session.data?.user.name,
                    user: session.data?.user.id,
                    orders: JSON.stringify(getOrderPayload())
                },
                handler : handleSuccess

            }


            const razorPayInstance = new Razorpay(options)
            razorPayInstance.open()
            
            razorPayInstance.on("payment.failed",(err:any)=>{
                setOpen(true)
                if(!onFailed){
                    return
                }

                const payload = {
                    reason: err.reason,
                    order_id: err.metadata.order_id,
                    payment_id : err.metadata.payment_id
                }

                onFailed(payload)
            })

        } catch (err) {
            return clientCatchError(err)
        }
    }
    return (
        <>
            {
                theme === "Sad" ?
                    <Button onClick={()=>payNow(total)} type="primary" danger size='large' className='!mt-4 !w-[200px] !font-medium' id="razorpay-btn">{title}</Button>
                
                :
                <Button onClick={()=>payNow(total)} type="primary"  size='large' className='!bg-green-500 hover:!bg-green-600 !mt-4 !w-[200px] !font-medium' id="razorpay-btn">{title}</Button>
            }
            <Modal open={open} footer={null} width={"50%"}  onCancel={()=>setOpen(false)}>
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle="An error occured during payment captured please try again after sometime"
                    extra={[
                        <Link href="/">
                            <Button type='primary' key="console">
                                Go Back
                            </Button>
                        </Link>
                    ]}
                />
            </Modal>
        </>
    )

}

export default Pay
