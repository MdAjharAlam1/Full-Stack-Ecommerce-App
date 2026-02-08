"use client"
import Fetcher from '@/lib/fetcher'
import { Result, Skeleton, Table, Tag } from 'antd'
import moment from 'moment'
import React from 'react'
import useSWR from 'swr'

const Payment = () => {
  const {data, error, isLoading} = useSWR('/api/payment',Fetcher)
  console.log(data)

  if(isLoading){
    return <Skeleton active/>
  }

  if(error){
    return <Result
      title = {error.message}
    />
  }

  const columns = [
    {
      title:"Fullname",
      key:"fullname",
      render:(item:any)=>(
        <label className='capitalize'>{item.user.fullname}</label>
      )
    },
    {
      title:"Email",
      key:"email",
      render:(item:any)=>(
        <label>{item.user.email}</label>
      )
    },
    {
      title:"Product",
      key:"product",
      render:(item:any)=>(
        <label className='capitalize'>{item.order.product.title}</label>
      )
    },
    {
      title:"PaymentId",
      key:"paymentId",
      render:(item:any)=>(
        <label>{item.paymentId}</label>
      )
    },
    {
      title:"Amount",
      key:"amount",
      render:(item:any)=>(
        <label>{item.order.price}</label>
      )
    },
    {
      title:"Vendor",
      key:"vendor",
      render:(item:any)=>(
        <Tag className='capitalize'>{item.vendor}</Tag>
      )
    },
    {
      title:"Date",
      key:"date",
      render:(item:any)=>(
        <label>{moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}</label>
      )
    }

  ]

  return (
    <div className='space-y-8'>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        bordered
      />
    </div>
  )
}

export default Payment
