import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderHistory } from './pages/OrderHistory';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AuthState, User, CartItem, Product } from './types';
import { MockApi } from './services/mockDb';

// --- Auth Context ---
interface AuthContextType {
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Cart Context ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// --- Wishlist Context ---
interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }: React.PropsWithChildren<{ requireAdmin?: boolean }>) => {
  const { auth } = useAuth();
  const location = useLocation();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && auth.user?.role !== 'ADMIN') {
    return <div className="text-center mt-20 text-red-600 font-bold">Access Denied: Admin Only</div>;
  }

  return <>{children}</>;
};

// --- Main App Component ---
const App: React.FC = () => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? { user: JSON.parse(saved), isAuthenticated: true } : { user: null, isAuthenticated: false };
  });

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('auth_user', JSON.stringify(user));
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_user');
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  
  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return;
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: q } : p));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (auth.user) {
      MockApi.getWishlist(auth.user.id).then(products => {
        setWishlistIds(products.map(p => p.id));
      });
    } else {
      setWishlistIds([]);
    }
  }, [auth.user]);

  const addToWishlist = async (productId: string) => {
    if (!auth.user) return; 
    await MockApi.addToWishlist(auth.user.id, productId);
    setWishlistIds(prev => [...prev, productId]);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!auth.user) return;
    await MockApi.removeFromWishlist(auth.user.id, productId);
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
        <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isInWishlist }}>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout cartCount={cart.length}><ProductList /></Layout>} />
              <Route path="/product/:id" element={<Layout cartCount={cart.length}><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout cartCount={cart.length}><Cart /></Layout>} />
              <Route path="/login" element={<Layout cartCount={cart.length}><Login /></Layout>} />
              <Route path="/checkout" element={<Layout cartCount={cart.length}><Checkout /></Layout>} />
              <Route path="/order-confirmation/:id" element={<Layout cartCount={cart.length}><OrderConfirmation /></Layout>} />
              
              {/* Customer Routes */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <Layout cartCount={cart.length}><Account /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Layout cartCount={cart.length}><OrderHistory /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Layout cartCount={cart.length}><Wishlist /></Layout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
               <Route path="/admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              } />
               <Route path="/admin/orders" element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              } />

            </Routes>
          </HashRouter>
        </WishlistContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
