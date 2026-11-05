import mongoose from 'mongoose';
import {
  UserModel,
  ProductModel,
  CategoryModel,
  OrderModel,
  CouponModel,
} from './models';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
} from './seedData';
import { hashPassword } from './auth';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://arslanjutt00225_db_user:saFGt4w5kQrkPByw@cluster0.nakpqpu.mongodb.net/petworld?retryWrites=true&w=majority';

export async function runMongoSeed() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Atlas connected for seeding');
    }

    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      const { _id, ...catData } = cat;
      await CategoryModel.findOneAndUpdate(
        { slug: cat.slug },
        catData,
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${INITIAL_CATEGORIES.length} categories.`);

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      const { _id, ...prodData } = prod;
      await ProductModel.findOneAndUpdate(
        { slug: prod.slug },
        prodData,
        { upsert: true, new: true }
      );
    }
    console.log(`Seeded ${INITIAL_PRODUCTS.length} products.`);

    // Seed Coupons
    for (const c of INITIAL_COUPONS) {
      const { _id, ...couponData } = c;
      await CouponModel.findOneAndUpdate(
        { code: c.code },
        couponData,
        { upsert: true, new: true }
      );
    }

    // Seed Admin & Customer
    const adminPassword = await hashPassword('AdminPassword123!');
    await UserModel.findOneAndUpdate(
      { email: 'admin@petworld.com' },
      {
        name: 'PetWorld Administrator',
        email: 'admin@petworld.com',
        password: adminPassword,
        phone: '+92 300 123 4567',
        role: 'admin',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      { upsert: true, new: true }
    );

    const custPassword = await hashPassword('Customer123!');
    const customer = await UserModel.findOneAndUpdate(
      { email: 'ayesha@example.com' },
      {
        name: 'Ayesha Khan',
        email: 'ayesha@example.com',
        password: custPassword,
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
      },
      { upsert: true, new: true }
    );

    // Seed Sample Initial Order
    await OrderModel.findOneAndUpdate(
      { orderNumber: 'PW-2026-1001' },
      {
        orderNumber: 'PW-2026-1001',
        userId: customer._id.toString(),
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
        shippingCost: 0,
        total: 64.98,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'delivered',
      },
      { upsert: true, new: true }
    );

    console.log('MongoDB Atlas seeding completed successfully!');
    return { success: true };
  } catch (err) {
    console.error('Error during MongoDB Atlas seeding:', err);
    return { success: false, error: (err as Error).message };
  }
}
