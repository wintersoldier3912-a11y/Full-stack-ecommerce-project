import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, User as UserIcon } from 'lucide-react';
import { useAuth } from '../App';

export const Account: React.FC = () => {
  const { auth } = useAuth();

  if (!auth.user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Please Log In</h2>
        <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-8 flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0 text-center sm:text-left">
        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
           {auth.user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{auth.user.name}</h2>
          <p className="text-slate-500">{auth.user.email}</p>
          <div className="mt-3 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wide">
            {auth.user.role} Account
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/orders" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Order History</h3>
          <p className="text-slate-500">View your past purchases and track current order status.</p>
        </Link>

        <Link to="/wishlist" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">My Wishlist</h3>
          <p className="text-slate-500">Manage the products you've saved for later.</p>
        </Link>
      </div>
    </div>
  );
};
