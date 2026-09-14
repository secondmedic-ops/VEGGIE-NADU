export type Language = 'en' | 'ta';

export type ProductUnit = 'kg' | 'piece' | 'packet' | 'bunch' | '500g' | '250g';

export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  slug: string;
  displayOrder: number;
  icon?: string;
  description_en?: string;
  description_ta?: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  categoryId: string;
  description_en: string;
  description_ta: string;
  price: number; // in INR
  unit: ProductUnit;
  stock: number;
  images: string[];
  isAvailable: boolean;
  isBulkOnly: boolean;
  featured?: boolean;
  origin_en?: string;
  origin_ta?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  houseStreet: string;
  areaLandmark: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'cod_pending' | 'failed';
export type OrderStatus = 'placed' | 'packed' | 'courier_assigned' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  borzoOrderId?: string;
  borzoTrackingUrl?: string;
  courierName?: string;
  courierPhone?: string;
  deliveryEstimatedTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type BulkRequestStatus = 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'rejected';

export interface BulkRequest {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  itemsNeeded: string;
  estimatedQuantity: string;
  deliveryByDate: string;
  notes?: string;
  status: BulkRequestStatus;
  createdAt: string;
  quoteAmount?: number;
}

export type AdminRole = 'inventory' | 'orders' | 'owner';

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName: string;
}
