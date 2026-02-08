"use client";
import React, { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, message } from 'antd';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import axios from 'axios';
import Fetcher from '@/lib/fetcher';
import Pay from './shared/Pay';
import Image from 'next/image';

const Checkout = () => {
  const router = useRouter();
  const { data: cartData, error, isLoading } = useSWR('/api/cart', Fetcher);
  const [address, setAddress] = useState({
    street:'',
    city:'',
    state:'',
    country:'',
    pincode:''
  });
  const [saving, setSaving] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!cartData || cartData.length === 0) return <div>Your cart is empty.</div>;

  const handlePaymentSuccess = (payload: any) => {
    message.success('Payment successful!');
    router.push('/user/orders');
  };

  const handlePaymentFailure = (payload: any) => {
    message.error('Payment failed. Please try again.');
  };

  const getTotals = (cart: any) => {
    return cart.reduce((acc: number, item: any) => {
      const discountedPrice = item.product.price - (item.product.price * item.product.discount) / 100;
      return acc + discountedPrice * item.quantity;
    }, 0);
  };

  const totalAmount = getTotals(cartData);

  const handlePayNow = async () => {
    try {
        console.log(address)

      setSaving(true);
      await axios.put('/api/user/profile', { address });
      setSaving(false);
      message.success("Address saved successfully!");
      document.getElementById("razorpay-btn")?.click(); // trigger Razorpay
    } catch (err: any) {
      setSaving(false);
      message.error(err.response?.data?.error || "Failed to save address");
    }
  };

  return (
    <div className="checkout-container">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className='w-full grid grid-cols-2 gap-10'>
            <Form layout="vertical" className='!w-full'>
                <Form.Item label="Street" required>
                <Input.TextArea
                    rows={6}
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Enter your street"
                />
                </Form.Item>
                <Form.Item label="City" required>
                <Input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Enter your city"
                />
                </Form.Item>
                <Form.Item label="State" required>
                <Input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Enter your state"
                />
                </Form.Item>
                <Form.Item label="Country" required>
                <Input
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="Enter your country"
                />
                </Form.Item>
                <Form.Item label="Pincode" required>
                <Input
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder="Enter your pincode"
                />
                </Form.Item>
            </Form>
            <div className="order-summary">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className='flex flex-col gap-4'>
                    {
                        cartData.map((item: any, index: number) => (
                            <Card key={index} className="mb-4">
                                <div className="flex justify-between items-center">
                                    <div className='flex gap-4'>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.title}
                                            width={100}
                                            height={50}
                                        />
                                        <div>
                                            <h3 className="text-md font-medium">{item.product.title}</h3>
                                            <p>
                                                {item.quantity} × ₹
                                                {item.product.price - (item.product.price * item.product.discount) / 100} ({item.product.discount}% off)
                                            </p>

                                        </div>
                                    </div>
                                    <p className="font-semibold">
                                        ₹{(item.quantity * (item.product.price - (item.product.price * item.product.discount) / 100)).toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        ))
                    }

                    <div className="flex justify-between items-center mt-4">
                    <h3 className="text-lg font-medium">Total Amount:</h3>
                    <p className="text-lg font-semibold">₹{totalAmount.toFixed(2)}</p>
                    </div>

                </div>
            </div>
        </div>  


      <Button
        type="primary"
        size='large'
        loading={saving}
        disabled={!address}
        onClick={handlePayNow}
        className="!bg-blue-600 hover:!bg-blue-700 !mt-6 !w-[200px]"
        
      >
        Save Address & Continue
      </Button>

      {/* Hidden Razorpay Trigger */}
      <div className="!hidden">
        <Pay
          title="Pay Now"
          data={cartData}
          total={totalAmount}
          onSucess={handlePaymentSuccess}
          onFailed={handlePaymentFailure}
        />
      </div>
    </div>
  );
};

export default Checkout;
