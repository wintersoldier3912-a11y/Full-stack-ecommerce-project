import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { MockApi } from '../../services/mockDb';
import { Order, Product } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([MockApi.getOrders(), MockApi.getProducts()]).then(([orders, products]) => {
      const revenue = orders.reduce((acc, o) => acc + o.total, 0);
      setStats({
        revenue,
        orders: orders.length,
        products: products.length
      });

      // Prepare Chart Data (Revenue by Day - Mocked logic for demo)
      // Grouping orders by simplistic date for visualization
      const chartMap = new Map();
      orders.forEach(o => {
        const date = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        chartMap.set(date, (chartMap.get(date) || 0) + o.total);
      });
      // If no data, fill with dummy
      if (chartMap.size === 0) {
         setData([
           { name: 'Mon', revenue: 1200 },
           { name: 'Tue', revenue: 2100 },
           { name: 'Wed', revenue: 800 },
           { name: 'Thu', revenue: 1600 },
           { name: 'Fri', revenue: 2300 },
         ])
      } else {
        setData(Array.from(chartMap).map(([name, revenue]) => ({ name, revenue })));
      }
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={stats.orders} icon={TrendingUp} color="bg-blue-500" />
        <StatCard title="Total Products" value={stats.products} icon={ShoppingBag} color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};
