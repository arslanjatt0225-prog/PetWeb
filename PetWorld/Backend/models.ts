import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser, IProduct, ICategory, IOrder, ICoupon, ISubscriber, IContactMessage } from './types';

// USER SCHEMA
const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String, default: null, index: true },
    verificationTokenExpiresAt: { type: Date, default: null },
    lastVerificationEmailSentAt: { type: Date, default: null },
    resetPasswordTokenHash: { type: String, default: null, index: true },
    resetPasswordExpiresAt: { type: Date, default: null },
    lastPasswordResetSentAt: { type: Date, default: null },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
    addresses: [
      {
        id: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean,
      },
    ],
  },
  { timestamps: true }
);

// PRODUCT SCHEMA
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 10 },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    image: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    specs: { type: Map, of: String },
  },
  { timestamps: true }
);

// CATEGORY SCHEMA
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ORDER SCHEMA
const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'Pakistan' },
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        image: String,
        quantity: Number,
        category: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    couponCode: { type: String },
    lastEmailNotificationStatus: { type: String, default: null },
    orderConfirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// COUPON SCHEMA
const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// SUBSCRIBER SCHEMA
const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// CONTACT MESSAGE SCHEMA
const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export Mongoose Models with Next.js hot-reload cache guard
export const UserModel: Model<IUser & Document> =
  mongoose.models.User || mongoose.model<IUser & Document>('User', UserSchema);

export const ProductModel: Model<IProduct & Document> =
  mongoose.models.Product || mongoose.model<IProduct & Document>('Product', ProductSchema);

export const CategoryModel: Model<ICategory & Document> =
  mongoose.models.Category || mongoose.model<ICategory & Document>('Category', CategorySchema);

export const OrderModel: Model<IOrder & Document> =
  mongoose.models.Order || mongoose.model<IOrder & Document>('Order', OrderSchema);

export const CouponModel: Model<ICoupon & Document> =
  mongoose.models.Coupon || mongoose.model<ICoupon & Document>('Coupon', CouponSchema);

export const SubscriberModel: Model<ISubscriber & Document> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber & Document>('Subscriber', SubscriberSchema);

export const ContactMessageModel: Model<IContactMessage & Document> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage & Document>('ContactMessage', ContactMessageSchema);
