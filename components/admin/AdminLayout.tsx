"use client"
import React, { FC } from 'react';
import {
  CarryOutOutlined,
  CreditCardOutlined,
  CrownOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,

} from '@ant-design/icons';

import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import ChildrenInterface from '@/interface/children.interface';
import Link from 'next/link';
import Logo from '../shared/Logo';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const getBreadCrumb = (pathname:string)=>{
  const pathSegments = pathname.split("/")
  const breadcrumbItems = pathSegments.map((item)=>({
    title: item
  }))
  return breadcrumbItems
}


const AdminLayout:FC<ChildrenInterface> = ({children}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname()
  const session = useSession()

  const logout = async()=>{
    await signOut()
  }

  const menus = [
    {  
      icon:<CarryOutOutlined/>,
      label:<Link href="/admin/products">Products</Link>,
      key:"products"
    },
    {   
      icon:<OrderedListOutlined/>,
      label:<Link href="/admin/order">Orders</Link>,
      key:"orders"
    },
    {
      icon:<CreditCardOutlined/>,
      label:<Link href="/admin/payment">Payments</Link>,
      key:"payments"
    },
    {
      icon:<UserOutlined/>,
      label:<Link href="/admin/users">Users</Link>,
      key:"users"
    }
  ]
  
  const accountMenu ={
    items:[
      {
        icon:<CrownOutlined/>,
        label:<a className='capitalize text-center font-bold'>{session?.data?.user.role}</a>,
        key:"role"
      },

      {
        icon:<ProfileOutlined/>,
        label:<a>{session?.data?.user.name}</a>,
        key:"fullname"
      },
      {
        icon:<LogoutOutlined/>,
        label:<a onClick={logout}>Logout</a>,
        key:"logout"
      },
      {
        icon:<SettingOutlined/>,
        label:<a>Settings</a>,
        key:"settings"
      }
    ]
  }

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" items={menus} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center' >
            <div className='px-8 flex items-center justify-between w-full'>
                <Logo/>
                <div>
                  <Dropdown menu={accountMenu}>
                    <Avatar
                      size="large"
                      src="/images/avt.avif"
                    />
                    
                  </Dropdown>
                </div>
            </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} className='px-8 flex flex-col gap-6'>
        <Breadcrumb
          items={getBreadCrumb(pathname)}
        />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;