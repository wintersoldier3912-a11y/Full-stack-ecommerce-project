
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Star } from 'lucide-react';
import { MockApi } from '../services/mockDb';
import { Product, Review } from '../types';
import { useCart, useAuth, useWishlist } from '../App';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Review Form State
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (id) {
      Promise.all([
        MockApi.getProduct(id),
        MockApi.getReviews(id)
      ]).then(([p, r]) => {
        setProduct(p || null);
        if (p) {
          setSelectedImage(p.imageUrl);
        }
        setReviews(r);
        setLoading(false);
        
        if (p && auth.user) {
          MockApi.canReview(auth.user.id, p.id).then(setCanReview);
        }
      });
    }
  }, [id, auth.user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const toggleWishlist = () => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    setSubmittingReview(true);
    setReviewError('');

    try {
      const newReview = await MockApi.addReview({
        productId: product.id,
        userId: auth.user.id,
        userName: auth.user.name,
        rating: userRating,
        comment: reviewComment
      });
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setUserRating(5);
      
      // Refresh product data to update rating avg
      const updatedProduct = await MockApi.getProduct(product.id);
      if (updatedProduct) setProduct(updatedProduct);

    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Ensure images array exists, fallback to imageUrl if empty
  const gallery = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden md:flex mb-12">
        {/* Image Gallery Section */}
        <div className="md:w-1/2 bg-gray-100 relative flex flex-col">
          <div className="relative aspect-square w-full">
            <img 
              src={selectedImage || product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transition-opacity duration-300" 
            />
            <button 
              onClick={toggleWishlist}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
            >
              <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
            </button>
          </div>
          
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex space-x-2 p-4 overflow-x-auto bg-white border-t border-gray-100">
              {gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-600 ring-1 ring-blue-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 md:w-1/2 flex flex-col">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {product.category}
              </span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-bold text-slate-700">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
                <span className="ml-1 text-xs text-slate-500">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.title}</h1>
            <p className="text-2xl font-medium text-slate-900 mb-6">${product.price.toFixed(2)}</p>
            <div className="prose prose-sm text-slate-600 mb-8">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-medium text-slate-700">Quantity</span>
               <div className="flex items-center border border-gray-200 rounded-lg">
                 <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-gray-50 text-slate-600"
                 >
                   <Minus className="h-4 w-4" />
                 </button>
                 <span className="w-12 text-center font-medium">{qty}</span>
                 <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-2 hover:bg-gray-50 text-slate-600"
                  disabled={qty >= product.stock}
                 >
                   <Plus className="h-4 w-4" />
                 </button>
               </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center py-4 px-8 rounded-xl text-white font-bold transition-all ${
                product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>

        {/* Write Review Form */}
        {auth.isAuthenticated && canReview && (
          <div className="mb-10 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            {reviewError && <div className="mb-4 text-red-600 text-sm">{reviewError}</div>}
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>
              <button 
                type="submit" 
                disabled={submittingReview}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {!auth.isAuthenticated && (
           <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
             Please <span className="font-bold cursor-pointer underline" onClick={() => navigate('/login', { state: { from: { pathname: `/product/${id}` } } })}>log in</span> to write a review.
           </div>
        )}

        {auth.isAuthenticated && !canReview && reviews.length > 0 && (
          <div className="mb-8 text-sm text-gray-500 italic">
            Only verified purchasers can leave reviews.
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-slate-500">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{review.userName}</p>
                      <div className="flex items-center">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                         ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 text-sm mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
