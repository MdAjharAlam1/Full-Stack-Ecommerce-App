import ChildrenInterface from '@/interface/children.interface'
import React, { FC } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const layout: FC<ChildrenInterface> = ({children}) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

export default layout
