"use client"
import clientCatchError from '@/lib/clientCatchError'
import { Button, Divider, Form, Input, message } from 'antd'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const Setting = () => {
  const [userFormData] = Form.useForm()
  const session = useSession()
  
  // useEffect(() => {
  //   if (session) {
  //     const user = session.data?.user || null;
  //     userFormData.setFieldsValue({
  //       fullname: user?.name,
  //       email: user?.email!,
  //       mobile: user?.mobile || "",
  //       street: user?.address?.street || "",
  //       city: user?.address?.city || "",
  //       state: user?.address?.state || "",
  //       country: user?.address?.country || "",
  //       pincode: user?.address?.pincode || "",
  //     });
  //   }
  // }, [session]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user/profile");
        const user = data
        console.log(user)
  
        userFormData.setFieldsValue({
          fullname: user.fullname,
          email: user.email,
          mobile: user.mobile || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
          pincode: user.address?.pincode || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
  
    fetchUser();
  }, []); 

  const handleUserUpdate = async(values:any)=>{
    try {
        const payload={
          fullname: values.fullname,
          mobile:values.mobile,
          email:values.email,
          address:{
            street: values.street,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode
          }
        }
        console.log(payload)
        const{data}=await axios.put('/api/user/profile', {userData:payload})
        console.log(data)
        message.success('Profile Update Sucessfully')
    } catch (err) {
      return clientCatchError(err)
    }
  }


  return (
    <div>
      <h1 className='text-lg font-medium'>Profile Information</h1>
      <Divider/>
      <div>
          <Form layout='vertical' form={userFormData} onFinish={handleUserUpdate}>
            <div className='grid grid-cols-3 gap-8'>
              <Form.Item label="Fullname" name="fullname" required>
                <Input placeholder='fullname'/>
              </Form.Item>
              <Form.Item label="Phone Number" name="mobile"  required>
                <Input placeholder='mobile number'/>
              </Form.Item>
              <Form.Item label="Email" name="email" required>
                <Input placeholder='email'/>
              </Form.Item>
              <Form.Item label="Street" name="street" required>
                <Input placeholder='street'/>
              </Form.Item>
              <Form.Item label="City" name="city" required>
                <Input placeholder='city'/>
              </Form.Item>
              <Form.Item label="State" name="state" required>
                <Input placeholder='state'/>
              </Form.Item>
              <Form.Item label="Country" name="country" required>
                <Input placeholder='country'/>
              </Form.Item>
              <Form.Item label="Pincode" name="pincode" required>
                <Input placeholder='pincode'/>
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType='submit' danger size='large'>Update Profile</Button>
            </Form.Item>
          </Form>
      </div>
    </div>
  )
}

export default Setting
