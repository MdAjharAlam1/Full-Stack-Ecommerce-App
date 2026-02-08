"use client"

import DataInterface from '@/interface/data.interface'
import clientCatchError from '@/lib/clientCatchError'
import priceCalculate from '@/lib/price-calculate'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { mutate } from 'swr'

const Products : FC<DataInterface> = ({data}) => {
    const[isBroswer,setIsBroswer] = useState(false)
    const router = useRouter()

    useEffect(()=>{
        setIsBroswer(true)
    },[])
    if(!isBroswer){
        return null
    }

    const addToCart = async(id:string)=>{
        try {
            const session = getSession()
            if(!session){
                return router.push("/login")
            }
            await axios.post('/api/cart',{product:id})
            message.success("Product added to cart ")
            mutate('/api/cart?count=true')
            
            
        } catch (err) {
            return clientCatchError(err)
        }
    }

  return (
    <div className='grid grid-cols-5 gap-12'>
        {
            data.data.map((item:any,index:number)=>(
                <Card
                    key={index}
                    hoverable
                    cover={
                        <div className='w-full h-[180px] relative'>
                            <Image fill src={item.image} alt={item.title} priority sizes="(max-width: 768px) 100vw, 33vw" className='rounded-t-lg object-cover'/>
                        </div>
                    }
                >
                    <Card.Meta
                        title={<Link href={`/products/${item.title.toLowerCase().split(" ").join("-")}`} className='!text-inherit hover:!underline'>{item.title}</Link>}
                        description={
                            <div className='flex  gap-2'>
                                <label className='font-medium'>₹{priceCalculate(item.price, item.discount)}</label>
                                <del>₹{item.price}</del>
                                <label>({item.discount}% off)</label>
                            </div>
                        }
                    />
                    
                    <div className='flex flex-col gap-4 mt-6'>
                        <Button onClick={()=>addToCart(item._id)} type="primary" size='large' icon={<ShoppingCartOutlined/>}>Add to cart</Button>
                        <Link href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}>
                            <Button className='!w-full' type="primary" size='large' danger> Buy now </Button>
                        </Link>

                    </div>

                </Card>
            ))
        }
    </div>
  )
}

export default Products
