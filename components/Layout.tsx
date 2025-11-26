import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                EcomCore
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Shop</Link>
              {auth.isAuthenticated && (
                <>
                  <Link to="/orders" className={isActive('/orders')}>My Orders</Link>
                  <Link to="/wishlist" className={isActive('/wishlist')}>Wishlist</Link>
                </>
              )}
              {auth.isAuthenticated && auth.user?.role === 'ADMIN' && (
                <Link to="/admin" className="px-3 py-1 rounded-full bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                  Admin Console
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {auth.isAuthenticated && (
                <Link to="/wishlist" className="text-slate-600 hover:text-red-500">
                  <Heart className="h-6 w-6" />
                </Link>
              )}
              
              <Link to="/cart" className="relative group">
                <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {auth.isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/account" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {auth.user?.name.charAt(0)}
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2">
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-slate-700">Shop</Link>
              {auth.isAuthenticated && (
                <>
                  <Link to="/account" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-slate-700">My Account</Link>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-slate-700">My Orders</Link>
                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-slate-700">Wishlist</Link>
                </>
              )}
              {auth.isAuthenticated && auth.user?.role === 'ADMIN' && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-blue-600">Admin Dashboard</Link>
              )}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {auth.isAuthenticated ? (
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-2 py-2 text-red-600 font-medium">
                    <LogOut className="h-4 w-4" /> <span>Sign Out</span>
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-2 text-base font-medium text-blue-600">Sign In</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <span className="text-lg font-bold text-slate-800">EcomCore</span>
              <p className="mt-2 text-sm text-slate-500">Built for modern commerce.</p>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
              <a href="#" className="hover:text-slate-900">Support</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-xs text-slate-400">
            &copy; 2024 EcomCore System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
