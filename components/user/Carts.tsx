"use client"
import clientCatchError from '@/lib/clientCatchError'
import Fetcher from '@/lib/fetcher'
import priceCalculate from '@/lib/price-calculate'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Result, Skeleton, Space } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Pay from '../shared/Pay'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


const Carts = () => {
  const router = useRouter()
  const {data,error,isLoading} = useSWR("/api/cart",Fetcher)
  const [loading,setLoading] = useState({state:false, index:0, buttonIndex:0})

  if(isLoading){
    return <Skeleton active/>
  }

  if(error){
    return <Result
      title = {error.message}
    />
  }

  if(data.length === 0){
    return <Empty/>
  }

  const removeCart = async(id:string,index:number, buttonIndex:number)=>{
    try {
      setLoading({state:true, index, buttonIndex})
        await axios.delete(`/api/cart/${id}`)
        mutate('/api/cart')
    } catch (err) {
      return clientCatchError(err)
    }
    finally{
      setLoading({state:false, index:0, buttonIndex:0})
    }
  }

  const updateQuantity = async(num:number, id:string,index:number,buttonIndex:number)=>{
    try {
      setLoading({state:true, index, buttonIndex})
      await axios.put(`/api/cart/${id}`,{quantity:num})
      mutate('/api/cart')
    } 
    catch (err) {
      return clientCatchError(err)
    }
    finally{
      setLoading({state:false, index:0, buttonIndex:0})
    }
  }

  const getTotals = (cart: any) => {
    let totalOriginal = 0;
    let totalDiscount = 0;
    let payable = 0;
  
    for (let item of cart) {
      const original = item.product.price * item.quantity;
      const discount = (item.product.price * item.product.discount / 100) * item.quantity;
      const final = original - discount;
  
      totalOriginal += original;
      totalDiscount += discount;
      payable += final;
    }
  
    return { totalOriginal, totalDiscount, payable };
  };

  const totals = getTotals(data)



  return (
    <div className='flex flex-col gap-8'>
      {
        data.map((item:any,index:number)=>(
          <Card key={index} hoverable>
            <div className='flex justify-between items-center'>
              <div className='flex gap-4'>
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  width={100}
                  height={50}
                />
                <div>
                  <h1 className='text-lg font-medium capitalize'>{item.product.title}</h1>
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-base">₹ {priceCalculate(item.product.price, item.product.discount)}</label>
                    <del className='text-gray-500'>₹ {item.product.price}</del>
                    <label>({item.product.discount}% Off)</label>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Space.Compact block>
                  <Button 
                    loading={loading.state && loading.index === index && loading.buttonIndex === 0} 
                    size='large' 
                    icon={<MinusOutlined/>} 
                    onClick={()=>updateQuantity(item.quantity-1, item._id,index,0)}
                  />
                  <Button size="large">{item.quantity}</Button>
                  <Button 
                    loading={loading.state && loading.index === index && loading.buttonIndex === 1} 
                    size='large' 
                    icon={<PlusOutlined/>} 
                    onClick={()=>updateQuantity(item.quantity+1, item._id,index,1)}
                  />
                </Space.Compact>
                <Button onClick={()=>removeCart(item._id,index,2)} type="primary"  danger icon={<DeleteOutlined/>}/>
              </div>
            </div>
          </Card>
        ))
      }
      <div className='flex flex-col gap-1 items-end'>
        <div className='space-x-10'>
          <label className=" text-[16px] font-medium inline-block">Total Amount - </label>
          <label className='text-[17px] font-semibold'>{totals.totalOriginal.toLocaleString()}</label>
        </div>
        <div className='space-x-10'>
          <label className=" text-[16px] font-medium inline-block">Discount Amount - </label>
          <label className='text-[17px] font-semibold'>{totals.totalDiscount.toLocaleString()}</label>
        </div>
        <div className='border-b border-gray-200 w-[250px]'></div>
        <div className='space-x-10'>
          <label className="text-[16px] font-medium inline-block">Total Payable Amount - </label>
          <label className='text-[17px] font-semibold'>{totals.payable.toLocaleString()}</label>
        </div>
        <Link href="/checkout">
          <Button className='!w-full' type="primary" size='large' danger> Checkout </Button>
        </Link>
      </div>
    </div>
  )
}

export default Carts
