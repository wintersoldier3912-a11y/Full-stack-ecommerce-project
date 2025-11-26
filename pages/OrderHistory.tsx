import React, { useEffect, useState } from 'react';
import { MockApi } from '../services/mockDb';
import { Order } from '../types';
import { useAuth } from '../App';
import { Package } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    MockApi.getOrders().then(allOrders => {
      // In a real app, API would filter. Here we filter in memory.
      // For this MVP, we show all if admin, or user specific. 
      // Since the mock DB stores guests with 'guest' ID, we'll just show all orders for 'guest' if logged in user has matched email or ID.
      // Simplified: Show all orders if user is logged in for demo purposes, or filter by email.
      if (auth.user) {
        // Show orders that match user email OR were created by user ID
        const userOrders = allOrders.filter(o => o.customerEmail === auth.user?.email || o.userId === auth.user?.id);
        setOrders(userOrders);
      }
    });
  }, [auth.user]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order Placed</p>
                   <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total</p>
                   <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</p>
                   <p className="text-sm font-medium text-gray-900">{order.id}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="py-4 flex items-center">
                      <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
