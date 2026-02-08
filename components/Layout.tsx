"use client"
import ChildrenInterface from '@/interface/children.interface'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import "animate.css"
import React, { FC } from 'react'
import '@ant-design/v5-patch-for-react-19';
import Logo from './shared/Logo';
import Link from 'next/link';
import { CrownOutlined, LogoutOutlined, ProductOutlined, ProfileOutlined, ReconciliationOutlined, SettingOutlined, ShoppingCartOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { Avatar, Badge, Dropdown, Tooltip } from 'antd'
import { signOut, useSession } from 'next-auth/react'
import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
const navMenus = [
  {
    label:"Home",
    href:"/"
  },
  {
    label:"Shop",
    href:"/products"
  },

]

const Layout:FC<ChildrenInterface> = ({children}) => {
  const{data} = useSWR('/api/cart?count=true', Fetcher)
  const pathname = usePathname()
  const session = useSession()


  const blacklists =[
    "/admin",
    "/login",
    "/signup",
    "/user",
    "/auth-failed"
  ]

  const userMenu ={
    items:[
     
      {
        icon:<ProfileOutlined/>,
        label:<Link href="/user/carts" className='capitalize'>{session.data?.user.name}</Link>,
        key:"carts"
      },
      {
        icon:<ReconciliationOutlined/>,
        label:<Link href="/user/orders" className='capitalize'>Order</Link>,
        key:"order"
      },
      {
        icon:<SettingOutlined/>,
        label:<Link href="/user/setting">Settings</Link>,
        key:"settings"
      },
      {
        icon:<LogoutOutlined/>,
        label:<a onClick={()=>signOut()}>Logout</a>,
        key:"logout"
      }
    ]
  }
  const adminMenu ={
    items:[
      {
        icon:<ProfileOutlined/>,
        label:<Link href="/admin/products">{session.data?.user.name}</Link>,
        key:"fullname"
      },
      {
        icon:<CrownOutlined/>,
        label:<Link href="/admin/order">Admin Dashboard</Link>,
        key:"admin dashboard"
      },
      {
        icon:<LogoutOutlined/>,
        label:<a onClick={()=>signOut()}>Logout</a>,
        key:"logout"
      },
    ]
  }

  const accountMenu = {
    items:[
      {
        icon:<UserOutlined/>,
        label:<Link href="/login">Login</Link>,
        key:"login"

      },
      {
        icon:<UserAddOutlined/>,
        label:<Link href="/signup">Register</Link>,
        key:"register"

      }
    ]
  }

  const getMenu = (role:any) =>{
    if(role === "user"){
      return userMenu
    }
    if(role === "admin"){
      return adminMenu
    }

    signOut()
  }

  const isBlacklist =  blacklists.some((path)=>pathname.startsWith(path))
  if(isBlacklist){
    return(
      <AntdRegistry>
        <div>{children}</div>
      </AntdRegistry>
    )
  }


  return (
    <AntdRegistry>
      <nav className='bg-white shadow-lg px-12 sticky top-0 left-0 flex items-center justify-between z-10'>
        <Logo/>
        <div className='flex items-center gap-10'>
          {
            navMenus.map((item,index)=>(
              <Link key={index} className='py-6 text-md font-medium hover:text-green-500' href={item.href}>{item.label}</Link>
            ))
          }
        </div>
        <div>
          {
            !session.data && 
            <Dropdown menu={accountMenu}>
                <Avatar 
                  size="large"
                  src="/images/avt.avif"
                />
              </Dropdown>

          }
          {
            session.data &&
            <div className='flex items-center gap-8 animate__animated animate__fadeIn'>
              {
                session.data.user.role === "user" && 
                <Tooltip title="Your Cart">
                  <Link href="/user/carts">
                    <Badge count={data && data.count}>
                      <ShoppingCartOutlined className='!text-3xl !text-slate-600'/>
                    </Badge>
                  </Link>
                </Tooltip>
              }
              <Dropdown menu={getMenu(session.data.user.role)}>
                <Avatar 
                  size="large"
                  src="/images/avt.avif"
                />
              </Dropdown>

            </div>

          }

        </div>
      </nav> 
      <div className='w-10/12 mx-auto py-16'>
        {children}
      </div>
      <footer>
        <div className='bg-black text-white py-14'>
        </div>  
      </footer>

    </AntdRegistry>
  )
}

export default Layout
