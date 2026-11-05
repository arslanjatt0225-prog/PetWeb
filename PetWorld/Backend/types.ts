export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isEmailVerified?: boolean;
  verificationTokenHash?: string | null;
  verificationTokenExpiresAt?: string | null;
  lastVerificationEmailSentAt?: string | null;
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: string | null;
  lastPasswordResetSentAt?: string | null;
  avatar?: string;
  addresses?: Array<{
    id: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs?: Record<string, string>;
  createdAt: string;
}

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: ICartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  lastEmailNotificationStatus?: string | null;
  orderConfirmationSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountPercent: number;
  minSpend?: number;
  isActive: boolean;
  expiresAt: string;
}

export interface IReview {
  _id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  avatar?: string;
  createdAt: string;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface ISubscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ISiteSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  freeShippingThreshold: number;
  shippingRate: number;
  currency: string;
  currencySymbol: string;
}
