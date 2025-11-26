import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { MockApi } from '../services/mockDb';
import { Product } from '../types';
import { useAuth, useWishlist } from '../App';

export const Wishlist: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const { removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (auth.user) {
      MockApi.getWishlist(auth.user.id).then(data => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [auth.user]);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-10 text-center">Loading Wishlist...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <Heart className="h-6 w-6 text-red-500 fill-current mr-3" /> My Wishlist
      </h1>

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you want to buy later.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-square w-full overflow-hidden bg-gray-200">
                  <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-blue-600">{product.title}</h3>
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};