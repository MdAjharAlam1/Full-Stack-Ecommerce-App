"use client"

import { Button, Card, Form, Input, InputNumber } from 'antd'
import Image from 'next/image'
import React from 'react'
import Logo from './shared/Logo'
import { UserAddOutlined } from '@ant-design/icons'
import Link from 'next/link'
import clientCatchError from '@/lib/clientCatchError'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Signup = () => {
    const router = useRouter()
    const signup = async(value:any)=>{
        try {
            await axios.post("/api/user/signup", value)
            router.push("/login")
        } catch (err) {
            clientCatchError(err)
        }
    }

    return (
        <div className='bg-gray-100 h-screen grid grid-cols-2 animate__animated animate__fadeIn overflow-hidden'>
            <div className='relative'>
                <Image 
                    src="/images/signup.jpg" 
                    alt='signup'
                    fill
                    className='object-cover'
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className='flex items-center justify-center'>
                <Card className='!w-[480px] animate__animated animate__slideInRight'>
                    <div className='space-y-6'>
                        <div className='flex items-cente justify-center'>
                            <Logo/>
                        </div>
                        <Form layout='vertical' onFinish={signup}>
                            <Form.Item label="Fullname" name="fullname" rules={[{required:true}]}>
                                <Input size='large' placeholder='ravi kumar singh'/>
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{required:true,type:"email"}]}>
                                <Input size='large' placeholder='mail@example.com'/>
                            </Form.Item>
                            <Form.Item label="Phone Number" name="mobile" rules={[{required:true}]}>
                                <InputNumber size='large' className='!w-full' placeholder='+91887878887'/>
                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[{required:true}]}>
                                <Input.Password size='large' placeholder='password'/>
                            </Form.Item>
                            <Form.Item >
                                <Button htmlType='submit' type='primary' icon={<UserAddOutlined/>} danger size='large' className='!w-full !text-md'>Signup</Button>
                            </Form.Item>
                        </Form>
                        <div className='flex items-center gap-2'>
                            <p className='text-slate-400'>Already have an account ?</p>
                            <Link href="/login">Signin</Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Signup
