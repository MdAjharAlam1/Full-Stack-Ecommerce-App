"use client"
import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Skeleton, Pagination, Result, Input } from "antd";
import useSWR from "swr";
import Fetcher from "@/lib/fetcher";
import { debounce } from "lodash";
import clientCatchError from "@/lib/clientCatchError";
import axios from "axios";


const Users  = () => {
  const [page,setPage] = useState(1)
  const [limit,setLimit] = useState(16)
  const [users, setUser] = useState({data:[],total:0})
  const {data,error, isLoading} = useSWR(`/api/user?page=${page}&limit=${limit}`,Fetcher)


  useEffect(()=>{
    if(data){
      setUser(data)
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

  // console.log(users)

  const onPaginate = (page:number , limit:number) =>{
    setPage(page)
    setLimit(limit)
  }

  const onSearch = debounce(async(e)=>{
    try {
      const value = e.target.value
      const {data} = await axios.get(`/api/user?search=${value}`)
      setUser(data)
    } catch (err) {
      clientCatchError(err)
    }
  })

  const columns = [
    // {
    //   title: "Photo",
    //   dataIndex: "photo",
    //   key: "photo",
    //   render: (photo: string) => <Avatar src={photo} size="large" />,
    // },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: string) =>
    //     status === "active" ? (
    //       <Tag color="green">Active</Tag>
    //     ) : (
    //       <Tag color="red">Inactive</Tag>
    //     ),
    // },
  ];

  return (
    <div className="space-y-8">
        <div>
          <Input onChange={onSearch} size="large" placeholder="Search Users...." className="!w-[450px]"/>
        </div>
        <Table
          columns={columns}
          dataSource={users.data}
          bordered
          pagination={false} 
          
        />
      <div style={{display:"flex", justifyContent:"flex-end"}}>
        <Pagination
          current={page} 
          onChange={onPaginate} 
          total={users.total}
          pageSizeOptions={[16,32,64,100]}
          defaultPageSize={limit}
        />
      </div>
    </div>
  );
};

export default Users;
