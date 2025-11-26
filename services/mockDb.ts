
import { Product, Order, User, OrderStatus, Review } from '../types';

// --- SEED DATA ---

const SEED_PRODUCTS: Product[] = [
  { 
    id: '1', 
    title: 'Ergonomic Office Chair', 
    description: 'High-back mesh chair with lumbar support.', 
    price: 199.99, 
    category: 'Furniture', 
    stock: 15, 
    imageUrl: 'https://picsum.photos/400/400?random=1',
    images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=101', 'https://picsum.photos/400/400?random=201']
  },
  { 
    id: '2', 
    title: 'Wireless Noise Cancelling Headphones', 
    description: 'Premium sound with 30h battery life.', 
    price: 249.50, 
    category: 'Electronics', 
    stock: 8, 
    imageUrl: 'https://picsum.photos/400/400?random=2',
    images: ['https://picsum.photos/400/400?random=2', 'https://picsum.photos/400/400?random=102']
  },
  { 
    id: '3', 
    title: 'Mechanical Keyboard', 
    description: 'RGB backlit, cherry MX red switches.', 
    price: 89.99, 
    category: 'Electronics', 
    stock: 20, 
    imageUrl: 'https://picsum.photos/400/400?random=3',
    images: ['https://picsum.photos/400/400?random=3', 'https://picsum.photos/400/400?random=103']
  },
  { 
    id: '4', 
    title: 'Ceramic Coffee Mug Set', 
    description: 'Set of 4 minimalist matte black mugs.', 
    price: 34.00, 
    category: 'Home', 
    stock: 45, 
    imageUrl: 'https://picsum.photos/400/400?random=4',
    images: ['https://picsum.photos/400/400?random=4', 'https://picsum.photos/400/400?random=104']
  },
  { 
    id: '5', 
    title: 'Running Sneakers', 
    description: 'Lightweight breathable mesh for daily runs.', 
    price: 75.00, 
    category: 'Apparel', 
    stock: 12, 
    imageUrl: 'https://picsum.photos/400/400?random=5',
    images: ['https://picsum.photos/400/400?random=5', 'https://picsum.photos/400/400?random=105']
  },
  { 
    id: '6', 
    title: 'Smart Watch Series 5', 
    description: 'Health tracking, GPS, and waterproof.', 
    price: 299.00, 
    category: 'Electronics', 
    stock: 5, 
    imageUrl: 'https://picsum.photos/400/400?random=6',
    images: ['https://picsum.photos/400/400?random=6']
  },
  { 
    id: '7', 
    title: 'Cotton Crew Neck T-Shirt', 
    description: '100% organic cotton, regular fit.', 
    price: 19.99, 
    category: 'Apparel', 
    stock: 100, 
    imageUrl: 'https://picsum.photos/400/400?random=7',
    images: ['https://picsum.photos/400/400?random=7', 'https://picsum.photos/400/400?random=107']
  },
  { 
    id: '8', 
    title: 'Bamboo Standing Desk', 
    description: 'Electric height adjustable desk.', 
    price: 450.00, 
    category: 'Furniture', 
    stock: 3, 
    imageUrl: 'https://picsum.photos/400/400?random=8',
    images: ['https://picsum.photos/400/400?random=8', 'https://picsum.photos/400/400?random=108']
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    userId: 'guest',
    customerName: 'Alice Smith',
    customerEmail: 'alice@example.com',
    address: '123 Maple St, Springfield',
    total: 289.50,
    status: 'DELIVERED',
    items: [{ productId: '2', title: 'Headphones', price: 249.50, quantity: 1, imageUrl: '' }],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'ord-1002',
    userId: 'guest',
    customerName: 'Bob Jones',
    customerEmail: 'bob@example.com',
    address: '456 Oak Ave, Metropolis',
    total: 199.99,
    status: 'SHIPPED',
    items: [{ productId: '1', title: 'Office Chair', price: 199.99, quantity: 1, imageUrl: '' }],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-1003',
    userId: 'user-1',
    customerName: 'Standard User',
    customerEmail: 'user@test.com',
    address: '789 Pine Ln, Gotham',
    total: 199.99,
    status: 'DELIVERED',
    items: [{ productId: '1', title: 'Office Chair', price: 199.99, quantity: 1, imageUrl: '' }],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

const SEED_REVIEWS: Review[] = [
  { id: 'rev-1', productId: '1', userId: 'u-100', userName: 'Jane Doe', rating: 5, comment: 'Absolutely love this chair! My back pain is gone.', createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: 'rev-2', productId: '1', userId: 'u-101', userName: 'John Smith', rating: 4, comment: 'Great chair, but assembly was a bit tricky.', createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: 'rev-3', productId: '2', userId: 'u-100', userName: 'Jane Doe', rating: 5, comment: 'Best noise cancelling headphones I have ever owned.', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

// --- MOCK API SERVICE ---

const PRODUCTS_KEY = 'ecom_products';
const ORDERS_KEY = 'ecom_orders';
const REVIEWS_KEY = 'ecom_reviews';
const WISHLIST_KEY = 'ecom_wishlists';

const getLocalStorage = <T>(key: string, seed: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

const setLocalStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const MockApi = {
  // GET /api/products
  getProducts: async (): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 400)); // Simulate latency
    const products = getLocalStorage<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);
    const reviews = getLocalStorage<Review[]>(REVIEWS_KEY, SEED_REVIEWS);

    // Attach aggregated ratings and ensure images array exists
    return products.map(p => {
      const productReviews = reviews.filter(r => r.productId === p.id);
      const avg = productReviews.length > 0 
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
        : 0;
      
      const images = p.images || (p.imageUrl ? [p.imageUrl] : []);

      return {
        ...p,
        images,
        imageUrl: images[0] || '', // Ensure imageUrl is synced
        rating: avg,
        reviewCount: productReviews.length
      };
    });
  },

  // GET /api/products/:id
  getProduct: async (id: string): Promise<Product | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    const products = await MockApi.getProducts(); 
    return products.find(p => p.id === id);
  },

  // POST /api/admin/products
  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 500));
    const products = getLocalStorage<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);
    
    // Ensure images array is valid and imageUrl is set from it
    const images = productData.images && productData.images.length > 0 
      ? productData.images 
      : (productData.imageUrl ? [productData.imageUrl] : []);
    const imageUrl = images[0] || '';

    const newProduct: Product = { 
      ...productData, 
      id: Math.random().toString(36).substr(2, 9),
      images,
      imageUrl
    };
    
    setLocalStorage(PRODUCTS_KEY, [...products, newProduct]);
    return newProduct;
  },

  // PUT /api/admin/products/:id
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 500));
    const products = getLocalStorage<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    // Logic to sync imageUrl with images[0] if images is updated
    let updatedImages = updates.images;
    let updatedImageUrl = updates.imageUrl;

    if (updatedImages && updatedImages.length > 0) {
      updatedImageUrl = updatedImages[0];
    } else if (updatedImageUrl && (!updatedImages || updatedImages.length === 0)) {
      // If only imageUrl is updated, push it to images
      updatedImages = [updatedImageUrl];
    }

    const updated = { 
      ...products[index], 
      ...updates, 
      images: updatedImages || products[index].images,
      imageUrl: updatedImageUrl || products[index].imageUrl 
    };
    
    products[index] = updated;
    setLocalStorage(PRODUCTS_KEY, products);
    return updated;
  },

  // DELETE /api/admin/products/:id
  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
    const products = getLocalStorage<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    setLocalStorage(PRODUCTS_KEY, filtered);
  },

  // GET /api/orders
  getOrders: async (): Promise<Order[]> => {
    await new Promise(r => setTimeout(r, 400));
    return getLocalStorage<Order[]>(ORDERS_KEY, SEED_ORDERS);
  },

  // GET /api/orders/:id
  getOrder: async (id: string): Promise<Order | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    const orders = getLocalStorage<Order[]>(ORDERS_KEY, SEED_ORDERS);
    return orders.find(o => o.id === id);
  },

  // POST /api/checkout
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    await new Promise(r => setTimeout(r, 800)); 
    const orders = getLocalStorage<Order[]>(ORDERS_KEY, SEED_ORDERS);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: 'RECEIVED'
    };
    setLocalStorage(ORDERS_KEY, [newOrder, ...orders]);
    return newOrder;
  },

  // PATCH /api/admin/orders/:id/status
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await new Promise(r => setTimeout(r, 400));
    const orders = getLocalStorage<Order[]>(ORDERS_KEY, SEED_ORDERS);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error("Order not found");
    
    orders[index].status = status;
    setLocalStorage(ORDERS_KEY, orders);
    return orders[index];
  },

  // POST /api/auth/login
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    if (email === 'admin@test.com' && password === 'admin') {
      return { id: 'admin-1', email, name: 'Admin User', role: 'ADMIN' };
    }
    if (email === 'user@test.com' && password === 'user') {
      return { id: 'user-1', email, name: 'Standard User', role: 'CUSTOMER' };
    }
    throw new Error('Invalid credentials');
  },

  // GET /api/products/:id/reviews
  getReviews: async (productId: string): Promise<Review[]> => {
    await new Promise(r => setTimeout(r, 300));
    const reviews = getLocalStorage<Review[]>(REVIEWS_KEY, SEED_REVIEWS);
    return reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  canReview: async (userId: string, productId: string): Promise<boolean> => {
    const orders = getLocalStorage<Order[]>(ORDERS_KEY, SEED_ORDERS);
    const hasPurchased = orders.some(o => 
      o.userId === userId && 
      o.items.some(i => i.productId === productId)
    );
    return hasPurchased;
  },

  addReview: async (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    await new Promise(r => setTimeout(r, 500));
    const canReview = await MockApi.canReview(review.userId, review.productId);
    if (!canReview) {
      throw new Error("You must purchase this product to leave a review.");
    }
    const reviews = getLocalStorage<Review[]>(REVIEWS_KEY, SEED_REVIEWS);
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLocalStorage(REVIEWS_KEY, [newReview, ...reviews]);
    return newReview;
  },

  // GET /api/wishlist
  getWishlist: async (userId: string): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 300));
    const wishlists = getLocalStorage<Record<string, string[]>>(WISHLIST_KEY, {});
    const productIds = wishlists[userId] || [];
    const allProducts = await MockApi.getProducts();
    return allProducts.filter(p => productIds.includes(p.id));
  },

  addToWishlist: async (userId: string, productId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 200));
    const wishlists = getLocalStorage<Record<string, string[]>>(WISHLIST_KEY, {});
    const userList = wishlists[userId] || [];
    if (!userList.includes(productId)) {
      wishlists[userId] = [...userList, productId];
      setLocalStorage(WISHLIST_KEY, wishlists);
    }
  },

  removeFromWishlist: async (userId: string, productId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 200));
    const wishlists = getLocalStorage<Record<string, string[]>>(WISHLIST_KEY, {});
    const userList = wishlists[userId] || [];
    wishlists[userId] = userList.filter(id => id !== productId);
    setLocalStorage(WISHLIST_KEY, wishlists);
  }
};
