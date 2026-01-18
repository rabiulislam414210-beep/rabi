
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Product {
  id: string;
  code: string;
  name: string;
  companyName: string; // The brand or manufacturer
  description: string;
  price: number;
  category: string;
  image: string; // Base64 string
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  isActive: boolean;
  isAutomatic: boolean; // If true, applies without entering a code
  targetCustomerId?: string;
  targetProductId?: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'REGULAR' | 'PREMIUM' | 'VIP';
  joinedAt?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shippingAddress: string; 
  items: CartItem[];
  total: number;
  discountApplied?: Discount;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
}

export type View = 'DASHBOARD' | 'STORE' | 'PRODUCTS' | 'ORDERS' | 'CART' | 'DISCOUNTS' | 'JOIN' | 'CUSTOMERS';
