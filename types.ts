
export type Role = 'ADMIN' | 'CUSTOMER';

export type OrderStatus = 'RECEIVED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string; // Main image (synced with images[0])
  images: string[]; // All images
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string; // "guest" if not logged in for this MVP
  customerEmail: string;
  customerName: string;
  address: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
