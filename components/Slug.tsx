"use client";
import DataInterface from '@/interface/data.interface'
import priceCalculate from '@/lib/price-calculate';
import { Button, Card, Empty } from 'antd'
import Image from 'next/image'
import React, { FC } from 'react'
import Pay from './shared/Pay';
import { useRouter } from 'next/navigation';


interface TitleInterface extends DataInterface {
  title: string
}

const Slug: FC<TitleInterface> = ({ data, title }) => {
  const router = useRouter()
  if (!data) return <Empty />


  return (
    <div>
      <Card className="shadow-lg">
        <div className="flex gap-12">
          <Image
            src={data?.image}
            width={240}
            height={0}
            alt={data?.title}
            className="object-cover rounded-lg"
            style={{width:"auto", height:"auto"}}
            priority
          />
          <div>
            <h1 className="text-3xl font-semibold">{data?.title}</h1>
            <p className="text-slate-500 mt-5 mb-5">{data?.description}</p>
            <div className='text-2xl font-medium flex items-center gap-5'>
              <h1>₹{priceCalculate(data.price, data.discount)}</h1>
              <del className='text-slate-300'>₹{data.price}</del>
              <h1 className='text-rose-500'>({data.discount}% Off)</h1>
            </div>
            <Pay 
              data={data} 
              total={priceCalculate(data.price, data.discount)} 
              title='Buy Now' 
              theme='Happy'
              onSucess={()=>router.push('/user/orders')}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Slug
