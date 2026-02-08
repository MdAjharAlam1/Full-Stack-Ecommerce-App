"use client"
import ChildrenInterface from '@/interface/children.interface'
import { HomeOutlined, LogoutOutlined, ProductOutlined, ReconciliationOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { FC } from 'react'

const getBreadCrumb = (pathname:string)=>{
    const arr = pathname.split("/")
    const bread = arr.map((item)=>({
      title: item
    }))
    return bread
  }

const UserLayout:FC<ChildrenInterface> = ({children}) => {

    const pathname = usePathname()
    const session = useSession()

    const logout = async()=>{
        await signOut()
    }

    const menus = [

        {
            icon:<HomeOutlined/>,
            label:<Link href="/" className='capitalize'>Home</Link>,
            key:"home"
        },
        {   
          icon:<ShoppingOutlined/>,
          label:<Link href="/user/carts">Carts</Link>,
          key:"carts"
        },
        {
          icon:<ReconciliationOutlined/>,
          label:<Link href="/user/orders">Orders</Link>,
          key:"orders"
        },
        {
          icon:<SettingOutlined/>,
          label:<Link href="/user/setting">Setting</Link>,
          key:"setting"
        }
    ]
    return (
        <Layout className='min-h-screen'>
            <Sider width={300} className='border-r border-r-gray-100'>
                <Menu items={menus} className='!h-full' mode="inline" theme='light'/>
                <div className='bg-indigo-500 p-4 fixed bottom-0 left-0 w-[300px] flex flex-col gap-4 '>
                    <div className='flex items-center gap-3 '>
                        <Avatar className='!w-16 !h-16 !bg-orange-500 !text-2xl !text-center !font-semibold'>
                            A
                        </Avatar>
                        <div>
                            <h1 className='text-lg font-medium text-white'>{session.data?.user.name}</h1>
                            <p className='text-gray-300'>{session.data?.user.email}</p>
                        </div>
                    </div>
                    <Button onClick={logout} size='large' icon={<LogoutOutlined/>}>Logout</Button>
                </div>
            </Sider>
            <Layout>
                <Layout.Content>
                    <div className='w-11/12 mx-auto py-8 min-h-screen'>
                        <Breadcrumb 
                            items={getBreadCrumb(pathname)}
                        />
                        <Card className='!mt-6'>
                            {children}
                        </Card>
                    </div>
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default UserLayout
