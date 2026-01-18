
import { Product, Discount, Customer } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    code: 'CAM-Q-101',
    name: 'Quantum Lens Camera',
    companyName: 'Lumina Optics',
    description: 'A high-performance mirrorless camera for professionals.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    stock: 15
  },
  {
    id: '2',
    code: 'CHR-NX-202',
    name: 'Nexus Gaming Chair',
    companyName: 'Apex Comfort',
    description: 'Ergonomic design with lumbar support for long sessions.',
    price: 249.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=400',
    stock: 8
  },
  {
    id: '3',
    code: 'AUD-AS-303',
    name: 'Aero Stream Earbuds',
    companyName: 'Sonic Labs',
    description: 'Noise cancelling true wireless earbuds with 40h battery.',
    price: 159.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
    stock: 25
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'Rahim Ahmed', email: 'rahim@example.com', phone: '01711111111', type: 'REGULAR' },
  { id: 'CUST-002', name: 'Karim Ullah', email: 'karim@example.com', phone: '01822222222', type: 'PREMIUM' },
  { id: 'CUST-003', name: 'Sultana Razia', email: 'sultana@example.com', phone: '01933333333', type: 'VIP' }
];

export const INITIAL_DISCOUNTS: Discount[] = [
  { id: 'd1', code: 'WELCOME10', percentage: 10, isActive: true, isAutomatic: false, description: '10% off for everyone' },
  { id: 'd2', code: '01933333333', percentage: 30, isActive: true, isAutomatic: false, targetCustomerId: 'CUST-003', description: 'Exclusive 30% for Sultana' },
  { id: 'd3', code: '01822222222', percentage: 20, isActive: true, isAutomatic: false, targetCustomerId: 'CUST-002', description: '20% off for Karim' }
];
