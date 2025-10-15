"use client"

import React, { FC } from 'react';
import {
    CarryOutOutlined,
  CreditCardFilled,
  CreditCardOutlined,
  DesktopOutlined,
  FileOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  ProductOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import ChildrenInterface from '@/interface/children.interface';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   } as MenuItem;
// }

// const items: MenuItem[] = [
//   getItem('Option 1', '1', <PieChartOutlined />),
//   getItem('Option 2', '2', <DesktopOutlined />),
//   getItem('User', 'sub1', <UserOutlined />, [
//     getItem('Tom', '3'),
//     getItem('Bill', '4'),
//     getItem('Alex', '5'),
//   ]),
//   getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
//   getItem('Files', '9', <FileOutlined />),
// ];

const AdminLayout:FC<ChildrenInterface> = ({children}) => {

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
            label:<Link href="/admin/payments">Payments</Link>,
            key:"payments"
        },
        {
            icon:<UserOutlined/>,
            label:<Link href="/admin/user">Users</Link>,
            key:"users"
        }
    ]
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" items={menus} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
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