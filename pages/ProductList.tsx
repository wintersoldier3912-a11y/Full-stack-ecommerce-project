import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star } from 'lucide-react';
import { MockApi } from '../services/mockDb';
import { Product } from '../types';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await MockApi.getProducts();
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFiltered(result);
  }, [searchTerm, category, products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Featured Products</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
             <select 
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-sm w-full sm:w-auto"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
             >
               {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square w-full overflow-hidden bg-gray-200">
              <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{product.title}</h3>
              
              <div className="flex items-center mt-1 mb-2">
                <Star className={`h-3 w-3 ${product.rating && product.rating >= 1 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                <span className="text-xs text-slate-500 ml-1">
                  {product.rating ? product.rating.toFixed(1) : 'No reviews'} ({product.reviewCount || 0})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
                {product.stock < 10 && product.stock > 0 && (
                   <span className="text-xs text-orange-600 font-medium">{product.stock} left</span>
                )}
                {product.stock === 0 && (
                   <span className="text-xs text-red-600 font-medium">Out of stock</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};