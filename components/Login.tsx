"use client"
import { Button, Card, Divider, Form, Input } from 'antd'
import Image from 'next/image'
import React from 'react'
import Logo from './shared/Logo'
import { GoogleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { getSession, signIn } from 'next-auth/react'
import clientCatchError from '@/lib/clientCatchError'
import { useRouter } from 'next/navigation'

const Login = () => {

  const router = useRouter()

  const login = async(value:any) =>{
    try {
      const payload = {
        ...value,
        redirect:false
      }
      await signIn("credentials",payload)
      const session = await getSession()
      
      if(!session){
        throw new Error("Login Failed to user")
      }

      if(session.user.role === "user")
        return router.replace("/")

      if(session.user.role === "admin")
        return router.replace("/")
      
    } catch (err) {
      return clientCatchError(err)
    }
    
  }

  const loginWithGoogle = async() =>{
    try {
      const payload = {
        redirect:true,
        callbackUrl :"/"
      }
      const res = await signIn("google", payload)
      console.log(res)
    } 
    catch (err) {
      clientCatchError(err)
    }
  }

  return (
    <div className='bg-gray-100 h-screen grid grid-cols-2 animate__animated animate__fadeIn'>
        <div className='relative'>
          <Image
            src="/images/signup.jpg"
            alt="login"
            fill
            priority
            className='object-cover'
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className='flex items-center justify-center'>
          <Card className='!w-[480px] animate__animated animate__slideInRight'>
            <div className='space-y-6'>
              <div className='flex items-ceter justify-center'>
                <Logo/>
              </div>
              <Form layout='vertical' onFinish={login}>

                <Form.Item label="Email" name="email" rules={[{required:true,type:"email"}]}>
                  <Input size='large' placeholder='mail@example.com'/>
                </Form.Item>

                <Form.Item label="Password" name="password" rules={[{required:true}]}>
                  <Input.Password size='large' placeholder='password'/>
                </Form.Item>
                
                <Form.Item>
                  <Button type='primary' htmlType='submit' danger  className='!w-full' size='large'>Signin</Button>
                </Form.Item>

              </Form>
              <Divider/>
              <Button onClick={loginWithGoogle} icon={<GoogleOutlined/>} className='!w-full !text-blue-500' size='large'>Login with Google</Button>
              <div className='flex items-center gap-2'>
                <p className='text-slate-400'>Don't have an account ?</p>
                <Link href="/signup">Signup</Link>
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}

export default Login
