import React, { useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Fetcher from '@/lib/fetcher';
import Pay from './shared/Pay';

const Checkout = () => {
  const router = useRouter();
  const { data: cartData, error, isLoading } = useSWR('/api/product', Fetcher);
  const [address, setAddress] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!cartData || cartData.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const handlePaymentSuccess = (payload:any) => {
    message.success('Payment successful!');
    router.push('/user/orders');
  };

  const handlePaymentFailure = (payload:any) => {
    message.error('Payment failed. Please try again.');
  };

  const getTotals = (cart:any) => {
    let total = 0;
    for (let item of cart) {
      const discountedPrice = item.product.price - (item.product.price * item.product.discount) / 100;
      total += discountedPrice * item.quantity;
    }
    return total;
  };

  const totalAmount = getTotals(cartData);

  return (
    <div className="checkout-container">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <Form layout="vertical" onFinish={() => {}}>
        <Form.Item label="Shipping Address" required>
          <Input.TextArea
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your shipping address"
          />
        </Form.Item>
      </Form>

      <div className="order-summary">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartData.map((item:any, index:number) => (
          <Card key={index} className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{item.product.title}</h3>
                <p>
                  {item.quantity} x ₹{item.product.price - (item.product.price * item.product.discount) / 100} ({item.product.discount}% off)
                </p>
              </div>
              <p className="font-semibold">₹{(item.quantity * (item.product.price - (item.product.price * item.product.discount) / 100)).toFixed(2)}</p>
            </div>
          </Card>
        ))}

        <div className="flex justify-between items-center mt-4">
          <h3 className="text-lg font-medium">Total Amount:</h3>
          <p className="text-lg font-semibold">₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <Pay
        title="Pay Now"
        data={cartData}
        total={totalAmount}
        onSucess={handlePaymentSuccess}
        onFailed={handlePaymentFailure}
      />
    </div>
  );
};

export default Checkout;
