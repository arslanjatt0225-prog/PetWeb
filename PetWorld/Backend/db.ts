import mongoose from 'mongoose';
import {
  IUser,
  IProduct,
  ICategory,
  IOrder,
  IReview,
  ICoupon,
  IBlogPost,
  ISubscriber,
  IContactMessage,
  ISiteSettings,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BLOGS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from './seedData';
import { hashPassword } from './auth';

// In-Memory Database storage (Stateful & Hot-retained in Node server runtime)
interface InMemoryDB {
  users: IUser[];
  products: IProduct[];
  categories: ICategory[];
  orders: IOrder[];
  reviews: IReview[];
  coupons: ICoupon[];
  blogs: IBlogPost[];
  subscribers: ISubscriber[];
  messages: IContactMessage[];
  settings: ISiteSettings;
  initialized: boolean;
}

const globalForDb = global as unknown as { petWorldDb?: InMemoryDB; mongoConnected?: boolean };

const db: InMemoryDB = globalForDb.petWorldDb || {
  users: [],
  products: [],
  categories: [],
  orders: [],
  reviews: [],
  coupons: [],
  blogs: [],
  subscribers: [],
  messages: [],
  settings: INITIAL_SETTINGS,
  initialized: false,
};

if (!globalForDb.petWorldDb) {
  globalForDb.petWorldDb = db;
}

import {
  UserModel,
  ProductModel,
  CategoryModel,
  OrderModel,
  CouponModel,
} from './models';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri && !globalForDb.mongoConnected) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      globalForDb.mongoConnected = true;
      console.log('Successfully connected to MongoDB Atlas');

      const [mongoProds, mongoCats, mongoOrders, mongoUsers, mongoCoupons] = await Promise.all([
        ProductModel.find().lean(),
        CategoryModel.find().lean(),
        OrderModel.find().sort({ createdAt: -1 }).lean(),
        UserModel.find().lean(),
        CouponModel.find().lean(),
      ]);

      if (mongoProds && mongoProds.length > 0) {
        db.products = mongoProds.map((p) => ({ ...p, _id: p._id.toString() })) as any;
      }
      if (mongoCats && mongoCats.length > 0) {
        db.categories = mongoCats.map((c) => ({ ...c, _id: c._id.toString() })) as any;
      }
      if (mongoOrders && mongoOrders.length > 0) {
        db.orders = mongoOrders.map((o) => ({ ...o, _id: o._id.toString() })) as any;
      }
      if (mongoUsers && mongoUsers.length > 0) {
        db.users = mongoUsers.map((u) => ({ ...u, _id: u._id.toString() })) as any;
      }
      if (mongoCoupons && mongoCoupons.length > 0) {
        db.coupons = mongoCoupons.map((c) => ({ ...c, _id: c._id.toString() })) as any;
      }
      db.initialized = true;
    } catch (err) {
      console.warn('MongoDB connection failed or not reachable, using PetWorld internal persistent data store:', (err as Error).message);
    }
  }

  // Ensure initial seed if not already initialized
  if (!db.initialized) {
    await initSeedData();
    db.initialized = true;
  }
  return db;
}

async function initSeedData() {
  // Pre-seed Categories & Products
  db.categories = [...INITIAL_CATEGORIES];
  db.products = [...INITIAL_PRODUCTS];
  db.blogs = [...INITIAL_BLOGS];
  db.coupons = [...INITIAL_COUPONS];
  db.settings = { ...INITIAL_SETTINGS };

  // Initial Admin & Customer users
  const adminHashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'AdminPassword123!');
  const customerHashedPassword = await hashPassword('Customer123!');

  db.users = [
    {
      _id: 'usr-admin-1',
      name: 'PetWorld Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@petworld.com').toLowerCase(),
      password: adminHashedPassword,
      phone: '+92 300 123 4567',
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'usr-customer-1',
      name: 'Ayesha Khan',
      email: 'ayesha@example.com',
      password: customerHashedPassword,
      phone: '+92 321 987 6543',
      role: 'customer',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      addresses: [
        {
          id: 'addr-1',
          street: 'House 42, Block B, Gulberg III',
          city: 'Lahore',
          postalCode: '54000',
          country: 'Pakistan',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Initial Reviews matching reference design testimonials
  db.reviews = [
    {
      _id: 'rev-1',
      productId: 'prod-bed',
      userName: 'Ayesha Khan',
      userCity: 'Lahore',
      rating: 5,
      comment: 'Excellent quality products! My pets are very happy.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'rev-2',
      productId: 'prod-feeder',
      userName: 'Usman Raza',
      userCity: 'Karachi',
      rating: 5,
      comment: 'Fast delivery and great service.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'rev-3',
      productId: 'prod-harness',
      userName: 'Sara Ahmed',
      userCity: 'Islamabad',
      rating: 5,
      comment: 'Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    },
  ];

  // Initial Orders for Admin analytics
  db.orders = [
    {
      _id: 'ord-1001',
      orderNumber: 'PW-2026-1001',
      userId: 'usr-customer-1',
      customerName: 'Ayesha Khan',
      customerEmail: 'ayesha@example.com',
      customerPhone: '+92 321 987 6543',
      shippingAddress: {
        street: 'House 42, Block B, Gulberg III',
        city: 'Lahore',
        postalCode: '54000',
        country: 'Pakistan',
      },
      items: [
        {
          productId: 'prod-harness',
          name: 'Comfortable Dog Harness',
          price: 24.99,
          image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=80',
          quantity: 1,
          category: 'Dog Supplies',
        },
        {
          productId: 'prod-bed',
          name: 'Soft Pet Bed',
          price: 39.99,
          image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=700&q=80',
          quantity: 1,
          category: 'Dog Supplies',
        },
      ],
      subtotal: 64.98,
      discount: 0,
      shippingCost: 0, // Free over $50
      total: 64.98,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'delivered',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      _id: 'ord-1002',
      orderNumber: 'PW-2026-1002',
      customerName: 'Bilal Farooq',
      customerEmail: 'bilal@example.com',
      customerPhone: '+92 333 445 6789',
      shippingAddress: {
        street: 'Apartment 4B, Clifton Block 5',
        city: 'Karachi',
        postalCode: '75600',
        country: 'Pakistan',
      },
      items: [
        {
          productId: 'prod-feeder',
          name: 'Automatic Pet Feeder',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80',
          quantity: 1,
          category: 'Pet Food',
        },
      ],
      subtotal: 79.99,
      discount: 8.0,
      shippingCost: 0,
      total: 71.99,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'processing',
      couponCode: 'WELCOME10',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export { db };
