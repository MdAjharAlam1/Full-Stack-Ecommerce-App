"use client"
import Fetcher from '@/lib/fetcher'
import priceCalculate from '@/lib/price-calculate'
import { Card, Skeleton, Tag } from 'antd'
import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import useSWR from 'swr'

const Orders = () => {
  const {error, data,isLoading} = useSWR('/api/order',Fetcher)

  if(isLoading)
    return <Skeleton active/>

  if(error){
    return(
      <div>
        <h1>{error}</h1>
      </div>
    )
  }

  console.log(data)

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";

      case "processing":
        return "blue";

      case "shipped":
        return "cyan";
        
      case "delivered":
        return "green";
        
      case "canceled":
        return "red";

      case "returned":
        return "purple";

      case "failed":
        return "gray";

      default:
        return "default"; // fallback color
    }
  };
  

  return (
    <div className='flex flex-col gap-6'>
      {
        data.map((item:any,index:number)=>(
          <Card 
            key={index} 
            title={'ORDER_ID' + " - "  + item.orderId}
            extra={
              <label>{moment(item.createdAt).format('MMM DD, YYYY hh:mm:ss A')}</label>
            }
          >
            <div className='flex flex-col gap-6'>
              {
                item.products.map((product:any,pIndex:number)=>(
                  <Card key={pIndex} hoverable>
                    <div>
                      <div className='flex gap-4'>
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={100}
                          height={50}
                        />
                        <div className='flex justify-between gap-10'>
                          <div>
                            <h1 className='text-lg font-medium capitalize'>{product.title}</h1>
                            <div className="flex items-center gap-3">
                              <label className="font-medium text-base">₹ {priceCalculate(item.prices[pIndex], item.discounts[pIndex])}</label>
                              <del className='text-gray-500'>₹ {item.prices[pIndex]}</del>
                              <label>({item.discounts[pIndex]}% Off)</label>
                            </div>
                            <Tag color={getOrderStatusColor(item.status)} className='!mt-2'>{item.status.toUpperCase()}</Tag>
                          </div>
                          <div>
                            <h1>{item.quantitys[pIndex]} PCS</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                </Card>
                ))
              }
              
            </div>

          </Card>
        ))
      }
    </div>
  )
}

export default Orders
