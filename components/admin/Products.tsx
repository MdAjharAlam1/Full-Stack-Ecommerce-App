"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar, Form, Input, Button, Modal, Divider, InputNumber, Upload, message, Skeleton, Result, Pagination, Card, Popconfirm, Empty } from "antd";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import clientCatchError from "@/lib/clientCatchError";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Fetcher from "@/lib/fetcher";
import Image from "next/image";
import {debounce} from "lodash"



const Products = () => {
  const [productForm] = Form.useForm()
  const[open,setOpen] = useState(false)
  const[editId,setEditId] = useState<string | null >(null)
  const [page, setPage] = useState(1)
  const [limit,setLimit] = useState(16)
  const{data,error,isLoading} = useSWR(`/api/product?page=${page}&limit=${limit}`,Fetcher)
  const [products, setProducts] = useState({data:[],total:0})

  useEffect(()=>{
    if(data){
      setProducts(data)
    }
  },[data])

  
  if(isLoading){
    return <Skeleton/>
  }

  if(error){
    return(
      <Result
        title={error.message}
      />
    )
  }

  const onSearch = debounce (async(e:any)=>{
    try {
      
      const value = e.target.value.trim()
      const{data} = await axios.get(`/api/product?search=${value}`)
      setProducts(data)
    } catch (err) {
      clientCatchError(err)
    }
  },1000)
  
  const handleClose = ()=>{
    setOpen(false)
    setEditId(null)
    productForm.resetFields()
  }

  const handleCreateProduct = async(values:any) =>{
    try {
      values.image = values.image.file.originFileObj
      const formData = new FormData()
      for(let key in values){
        formData.append(key,values[key])
      }
      await axios.post('/api/product',formData)
      message.success("Product Created Successfully")

    } catch (err) {
      clientCatchError(err)
    }
  }

  const handleEditProduct = (item:any)=>{
    setOpen(true)
    setEditId(item._id)
    productForm.setFieldsValue(item)
  }

  const handleDeleteProduct = async(id:string)=>{
    try {
      await axios.delete(`/api/product/${id}`)
      mutate(`/api/product?page=${page}&limit=${limit}`)
      message.success("Product deleted Successfully")
    } catch (err) {
      clientCatchError(err)
    }
  }

  const saveProduct = async(values:any)=>{
    try {
      await axios.put(`/api/product/${editId}`,values)
      handleClose()
      mutate(`/api/product?page=${page}&limit=${limit}`)
      message.success("Product Update Successfully")
    } catch (err) {
      clientCatchError(err)
    }
  }

  const handleChangeImage = (id:string) =>{
    try {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.click()

      input.onchange = async() =>{
        
        if(!input.files){
          return
        }

        const file = input.files[0]
        input.remove()
        const formData = new FormData()
        formData.append("id",id)
        formData.append("image",file)
        await axios.put('/api/product/change-image',formData)
        message.success("Image changed Successfully")
        mutate(`/api/product?page=${page}&limit=${limit}`)
        
      }
      
    } catch (err) {
      return clientCatchError(err)
    }
  }


  const onPaginate = (page:number , limit:number) =>{
    setPage(page)
    setLimit(limit)
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Input 
          onChange={onSearch}
          placeholder="Search Products...."
          size="large"
          className="!w-[400px]"
        />
        <Button onClick={()=>setOpen(true)} type="primary" size="large" icon={<PlusOutlined/>}>Add Product</Button>
      </div>
      
      <div className="grid grid-cols-4 gap-8 ">
        {products && products.data.map((item: any, index: number) => (
          <Card 
            hoverable
            key={index}
            cover={
              <div className="relative w-full h-[150px]">
                <Popconfirm title="Do you want to change image" onConfirm={()=>handleChangeImage(item._id)}>
                  <Image src={item.image} fill alt={`product-${index}`} priority sizes="(max-width: 768px) 100vw, 33vw" className="rounded-t-lg object-cover" />
                </Popconfirm>
              </div>
            }
            actions={[
                <EditOutlined className="!text-green-400" onClick={()=>handleEditProduct(item)}/>,
                <Popconfirm title="Do you want to delete Product" onConfirm={()=>handleDeleteProduct(item._id)}>
                  <DeleteOutlined className="!text-rose-400" />
                </Popconfirm>
            ]}
          >
            <Card.Meta
              title={item.title}
              description={
                <div className="flex gap-2">
                  <label>{item.price}</label>
                  <del>{item.price}</del>
                  <label>{item.discount}% Off</label>
                </div>
              }
            />
            <Tag className="!mt-5" color="cyan">{item.stock} PCS</Tag>
           
          </Card>
        ))}
      </div>
      <div style={{display:"flex", justifyContent:"flex-end"}}>
        <Pagination 
          current={page} 
          onChange={onPaginate} 
          total={products.total}
          pageSizeOptions={[16,32,64,100]}
          defaultPageSize={limit}
        />
      </div>


      <Modal open={open} footer={null} width={720} onCancel={handleClose} maskClosable={false}>
        <h1 className="text-lg font-medium">Add New Product</h1>
        <Divider/>

        <Form layout="vertical" onFinish={editId ? saveProduct : handleCreateProduct} form={productForm}>
          <Form.Item name="title" label="Product Name" rules={[{required:true}]}>
            <Input size="large" placeholder="Product Name..."/>
          </Form.Item>

          <div className="grid grid-cols-3 gap-6">
            <Form.Item name="price" label="Price" rules={[{required:true,type:"number"}]}>
              <InputNumber size="large" placeholder="00.00" className="!w-full"/>
            </Form.Item>

            <Form.Item name="discount" label="Discount" rules={[{required:true,type:"number"}]}>
              <InputNumber size="large" placeholder="20" className="!w-full"/>
            </Form.Item>

            <Form.Item name="stock" label="Stock" rules={[{required:true,type:"number"}]}>
              <InputNumber size="large" placeholder="10" className="!w-full"/>
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description" rules={[{required:true}]}>
            <Input.TextArea rows={5} placeholder="Product Description"/>
          </Form.Item>

          {
            !editId &&
            <Form.Item name="image" rules={[{required:true}]}>
              <Upload fileList={[]}>
                <Button size="large" icon={<UploadOutlined/>}>Upload a product image</Button>
              </Upload>
            </Form.Item>

          }

          {
            editId ?
            <Button htmlType="submit" size="large" type="primary" danger icon={<SaveOutlined/>}>Save Changes</Button>
            :
            <Button htmlType="submit" size="large" type="primary" icon={<ArrowRightOutlined/>}>Add Product</Button>
            
          }

        </Form>
      </Modal>
    </div>
  );
};

export default Products;
