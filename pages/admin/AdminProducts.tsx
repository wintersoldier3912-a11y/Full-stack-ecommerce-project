
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { MockApi } from '../../services/mockDb';
import { Product } from '../../types';
import { Edit, Trash2, Plus, X, Upload } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [form, setForm] = useState({
    title: '', 
    price: '', 
    category: '', 
    stock: '', 
    description: '', 
    images: [] as string[]
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');

  const loadProducts = () => MockApi.getProducts().then(setProducts);
  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure at least one image is present (use placeholder if none)
    const imagesToSave = form.images.length > 0 
      ? form.images 
      : [`https://picsum.photos/400/400?random=${Date.now()}`];

    const productData = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      images: imagesToSave,
      imageUrl: imagesToSave[0] // Main image
    };

    if (editingId) {
      await MockApi.updateProduct(editingId, productData);
    } else {
      await MockApi.createProduct(productData);
    }
    
    closeModal();
    loadProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: p.price.toString(),
      category: p.category,
      stock: p.stock.toString(),
      description: p.description,
      images: p.images && p.images.length > 0 ? p.images : [p.imageUrl]
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await MockApi.deleteProduct(id);
      loadProducts();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ title: '', price: '', category: '', stock: '', description: '', images: [] });
    setNewImageUrl('');
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={p.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.images?.length || 1} images</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={closeModal}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input required type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Stock</label>
                   <input required type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                
                {/* Image List */}
                <div className="space-y-2 mb-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                      <img src={img} alt="Preview" className="h-10 w-10 object-cover rounded" />
                      <span className="flex-1 text-xs text-gray-500 truncate">{img}</span>
                      {idx === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Main</span>}
                      <button type="button" onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {form.images.length === 0 && <p className="text-sm text-gray-400 italic">No images added yet.</p>}
                </div>

                {/* Add Image Input */}
                <div className="flex space-x-2">
                  <input 
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm" 
                    value={newImageUrl} 
                    onChange={e => setNewImageUrl(e.target.value)} 
                    placeholder="Enter image URL..." 
                  />
                  <button type="button" onClick={addImage} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
