"use client";
import React, { useState } from "react";
import { Table, Select, Skeleton, message, Tag, Result } from "antd";
import useSWR, { mutate } from "swr";
import Fetcher from "@/lib/fetcher";
import moment from "moment";
import clientCatchError from "@/lib/clientCatchError";
import axios from "axios";
import {useSession } from "next-auth/react";



const Orders = () => {
  const [orders, setOrders] = useState();
  const {data,error,isLoading} = useSWR(`/api/order`,Fetcher)
  const session = useSession()
  console.log(session)
  
  if(isLoading){
    return <Skeleton active/>
  }
  if(error){
    return(
      <Result
        title={error.message}
      />
    )
  }

  const handleChangeStatus = async(status:string, id:string)=>{
    try {
      const {data} = await axios.put(`/api/order/${id}`,{status})
      console.log(data)
      message.success("Order Status Update Sucessfully")
      mutate('/api/order')
    } catch (err) {
      return clientCatchError(err)
    }
  }

  const columns = [
    { 
      title: "Customer", 
      key: "fullname",
      render : (item:any)=>(
        <label>{item.user.fullname}</label>
      )
    },
    { 
      title: "Email", 
      key: "email",
      render :(item:any)=>(
        <label>{item.user.email}</label>
      )
    },
    {
      title:"Address",
      key:"address",
      render :(item:any)=>(
        <label>{item.user.address || "Address not found"}</label>
      )
    },
    { title: "Product",
      key: "product",
      render:(item:any)=>(
        <label>{item.product.title}</label>
      ) 
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price"

    },
    {
      title:"Discount (%)",
      dataIndex:"discount",
      key:"discount"
    },
    {
      title: "Status",
      key: "status",
      render: (item:any) => (
        <Select
          placeholder = "Status"
          defaultValue={item.status}
          style={{ width: 140 }}
          onChange={(valuee)=>handleChangeStatus(valuee,item._id)}
        >
          <Select.Option value="Processing"><Tag color="blue">Processing</Tag></Select.Option>
            <Select.Option value="Shipped"><Tag color="purple">Shipped</Tag></Select.Option>
            <Select.Option value="Delivered"><Tag color="green">Delivered</Tag></Select.Option>
            <Select.Option value="Cancelled"><Tag color="red">Cancelled</Tag></Select.Option>
            <Select.Option value="Returned"><Tag color="orange">Returned</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: "Date",
      key: "createdAt",
      render: (item:any) =>(
        <label>{moment(item.createdAt).format('MMM DD , YYYY hh:mm A')}</label>
      )
       
    },
  ];

  return (
    <div className="space-y-8">
      
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default Orders;
