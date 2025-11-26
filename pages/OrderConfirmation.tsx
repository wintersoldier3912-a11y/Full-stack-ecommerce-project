import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { MockApi } from '../services/mockDb';
import { Order } from '../types';

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      MockApi.getOrder(id).then(o => setOrder(o || null));
    }
  }, [id]);

  if (!order) return <div className="p-10 text-center">Loading Order Details...</div>;

  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-24 w-24 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
      <p className="text-slate-500 mb-8">Thank you for your purchase, {order.customerName}.</p>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-left mb-8">
        <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
          <span className="text-sm text-gray-500">Order ID</span>
          <span className="font-mono font-medium text-slate-900">{order.id}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
          <span className="text-sm text-gray-500">Amount Paid</span>
          <span className="font-bold text-slate-900">${order.total.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500">
          <p>We've sent a confirmation email to <span className="font-medium text-slate-900">{order.customerEmail}</span>.</p>
        </div>
      </div>

      <div className="space-x-4">
        <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Continue Shopping
        </Link>
        <Link to="/orders" className="inline-block px-6 py-3 bg-white border border-gray-300 text-slate-700 rounded-lg font-medium hover:bg-gray-50">
          View My Orders
        </Link>
      </div>
    </div>
  );
};
