import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../App';
import { useAuth } from '../App';
import { MockApi } from '../services/mockDb';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    address: '',
    city: '',
    zip: '',
    card: '4242 4242 4242 4242',
    exp: '12/25',
    cvc: '123'
  });

  if (cart.length === 0) return <div className="p-10 text-center">Your cart is empty</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await MockApi.createOrder({
        userId: auth.user?.id || 'guest',
        customerName: formData.name,
        customerEmail: formData.email,
        address: `${formData.address}, ${formData.city} ${formData.zip}`,
        total: cartTotal,
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        }))
      });
      
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      alert('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Checkout</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input required name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input required name="zip" value={formData.zip} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Payment Details (Mock)</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-2">
              <p>This is a mock checkout. No real payment is processed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input readOnly value={formData.card} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm border p-2 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700">Expiry</label>
                 <input readOnly value={formData.exp} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm border p-2 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">CVC</label>
                 <input readOnly value={formData.cvc} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm border p-2 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="text-lg font-bold text-slate-900">Total: ${cartTotal.toFixed(2)}</div>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
