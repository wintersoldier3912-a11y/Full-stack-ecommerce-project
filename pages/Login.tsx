import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { MockApi } from '../services/mockDb';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await MockApi.login(email, password);
      login(user);
      navigate(user.role === 'ADMIN' ? '/admin' : from);
    } catch (err: any) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700">Password</label>
             <input 
               type="password" 
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
               focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
             />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Demo Credentials</h4>
           <div className="space-y-2 text-sm text-slate-600">
             <div className="flex justify-between bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100" onClick={() => { setEmail('admin@test.com'); setPassword('admin'); }}>
               <span>Admin:</span>
               <span className="font-mono">admin@test.com / admin</span>
             </div>
             <div className="flex justify-between bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100" onClick={() => { setEmail('user@test.com'); setPassword('user'); }}>
               <span>Customer:</span>
               <span className="font-mono">user@test.com / user</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
