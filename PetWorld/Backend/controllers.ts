import mongoose from 'mongoose';
import { connectDB } from './db';
import { IProduct, IOrder, ICategory, IUser } from './types';
import {
  UserModel,
  ProductModel,
  CategoryModel,
  OrderModel,
  SubscriberModel,
  ContactMessageModel,
} from './models';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateResetToken,
  verifyResetToken,
  generateCryptoToken,
  hashToken,
} from './auth';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} from './emailService';


export async function getProducts(query: {
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  bestSeller?: boolean;
}) {
  const db = await connectDB();
  let list = [...db.products];

  if (query.category) {
    const cat = query.category.toLowerCase();
    list = list.filter(
      (p) =>
        p.categorySlug.toLowerCase() === cat ||
        p.category.toLowerCase().includes(cat)
    );
  }

  if (query.search) {
    const q = query.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (query.featured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (query.bestSeller) {
    list = list.filter((p) => p.isBestSeller);
  }

  if (query.sort) {
    if (query.sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (query.sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  return list;
}

export async function getProductByIdOrSlug(idOrSlug: string) {
  const db = await connectDB();
  return (
    db.products.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null
  );
}

export async function createProduct(data: Partial<IProduct>) {
  const db = await connectDB();
  const newProduct: IProduct = {
    _id: `prod-${Date.now()}`,
    name: data.name || 'New Product',
    slug: (data.name || 'new-product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    category: data.category || 'Dog Supplies',
    categorySlug: (data.category || 'Dog Supplies')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    price: Number(data.price) || 0,
    salePrice: data.salePrice ? Number(data.salePrice) : undefined,
    rating: 5.0,
    reviewCount: 0,
    stock: Number(data.stock) || 10,
    inStock: (Number(data.stock) || 10) > 0,
    isFeatured: !!data.isFeatured,
    isBestSeller: !!data.isBestSeller,
    image: data.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80',
    images: data.images?.length
      ? data.images
      : [data.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80'],
    description: data.description || 'High quality pet product.',
    features: data.features || ['Premium Pet Safe Material', 'Vet Recommended'],
    createdAt: new Date().toISOString(),
  };

  try {
    const { _id, ...mongoData } = newProduct;
    const doc = await ProductModel.create(mongoData);
    newProduct._id = doc._id.toString();
  } catch (err) {
    console.warn('MongoDB Product save notice:', (err as Error).message);
  }

  db.products.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<IProduct>) {
  const db = await connectDB();
  const index = db.products.findIndex((p) => p._id === id);
  if (index === -1) return null;

  const current = db.products[index];
  const updated: IProduct = {
    ...current,
    ...data,
    price: data.price !== undefined ? Number(data.price) : current.price,
    stock: data.stock !== undefined ? Number(data.stock) : current.stock,
    inStock: (data.stock !== undefined ? Number(data.stock) : current.stock) > 0,
  };

  try {
    if (mongoose.isValidObjectId(id)) {
      await ProductModel.findByIdAndUpdate(id, data);
    } else {
      await ProductModel.findOneAndUpdate({ slug: id } as any, data);
    }
  } catch {
    // fallback if custom id
  }

  db.products[index] = updated;
  return updated;
}

export async function deleteProduct(id: string) {
  const db = await connectDB();
  try {
    if (mongoose.isValidObjectId(id)) {
      await ProductModel.findByIdAndDelete(id);
    } else {
      await ProductModel.findOneAndDelete({ slug: id } as any);
    }
  } catch {}
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p._id !== id);
  return db.products.length < initialLength;
}

// Categories
export async function getCategories() {
  const db = await connectDB();
  return db.categories;
}

export async function createCategory(data: Partial<ICategory>) {
  const db = await connectDB();
  const newCat: ICategory = {
    _id: `cat-${Date.now()}`,
    name: data.name || 'New Category',
    slug: (data.name || 'category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    image: data.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    description: data.description || '',
    itemCount: 0,
  };
  db.categories.push(newCat);
  return newCat;
}

export async function updateCategory(id: string, data: Partial<ICategory>) {
  const db = await connectDB();
  const index = db.categories.findIndex((c) => c._id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...data };
  return db.categories[index];
}

export async function deleteCategory(id: string) {
  const db = await connectDB();
  db.categories = db.categories.filter((c) => c._id !== id);
  return true;
}

// Orders
export async function createOrder(data: {
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
  items: any[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  couponCode?: string;
}) {
  const db = await connectDB();
  const newOrder: IOrder = {
    _id: `ord-${Date.now()}`,
    orderNumber: `PW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: data.userId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    items: data.items,
    subtotal: data.subtotal,
    discount: data.discount || 0,
    shippingCost: data.shippingCost || 0,
    total: data.total,
    paymentMethod: data.paymentMethod || 'cod',
    paymentStatus: data.paymentMethod === 'card' ? 'completed' : 'pending',
    status: 'pending',
    couponCode: data.couponCode,
    orderConfirmationSent: true,
    lastEmailNotificationStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Decrement inventory stock
  for (const item of data.items) {
    const prod = db.products.find((p) => p._id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      prod.inStock = prod.stock > 0;
    }
  }

  try {
    const { _id, ...mongoOrder } = newOrder;
    const doc = await OrderModel.create(mongoOrder);
    newOrder._id = doc._id.toString();
  } catch (err) {
    console.warn('MongoDB Order save notice:', (err as Error).message);
  }

  db.orders.unshift(newOrder);

  // Send Order Confirmation Email to customer (background task, non-blocking)
  try {
    sendOrderConfirmationEmail(newOrder).catch((e) =>
      console.error('Order confirmation email trigger failed:', e)
    );
  } catch (err) {
    console.error('Email dispatch error on order creation:', err);
  }

  return newOrder;
}

export async function getOrders(filter?: { userId?: string; status?: string }) {
  const db = await connectDB();
  let list = [...db.orders];
  if (filter?.userId) {
    list = list.filter((o) => o.userId === filter.userId);
  }
  if (filter?.status) {
    list = list.filter((o) => o.status === filter.status);
  }
  return list;
}

export async function updateOrderStatus(orderId: string, status: IOrder['status']) {
  const db = await connectDB();
  const order = db.orders.find((o) => o._id === orderId || (o as any).orderNumber === orderId);
  if (!order) return null;

  const previousStatus = order.status;
  order.status = status;
  order.updatedAt = new Date().toISOString();

  // Prevent duplicate status update emails: only send if status legitimately changed
  if (order.lastEmailNotificationStatus !== status && previousStatus !== status) {
    order.lastEmailNotificationStatus = status;
    try {
      sendOrderStatusUpdateEmail(order, status).catch((e) =>
        console.error('Order status email trigger failed:', e)
      );
    } catch (err) {
      console.error('Email dispatch error on status update:', err);
    }
  }

  try {
    const filter = mongoose.isValidObjectId(orderId)
      ? { $or: [{ _id: orderId }, { orderNumber: orderId }] }
      : { orderNumber: orderId };
    await OrderModel.findOneAndUpdate(filter as any, {
      status,
      lastEmailNotificationStatus: order.lastEmailNotificationStatus,
    });
  } catch {}

  return order;
}

// Authentication
export async function loginUser(email: string, pass: string) {
  const db = await connectDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !user.password) {
    return { error: 'Invalid email or password' };
  }

  const isMatch = await comparePassword(pass, user.password);
  if (!isMatch) {
    return { error: 'Invalid email or password' };
  }

  const token = generateToken(user);
  const { password, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const db = await connectDB();
  const cleanEmail = data.email.toLowerCase().trim();
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  if (existing) {
    return { error: 'An account with this email already exists' };
  }

  if (data.password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }

  const hashedPassword = await hashPassword(data.password);

  // Generate cryptographically secure verification token & store only its SHA-256 hash
  const rawVerificationToken = generateCryptoToken();
  const verificationTokenHash = hashToken(rawVerificationToken);
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  const now = new Date().toISOString();

  const newUser: IUser = {
    _id: `usr-${Date.now()}`,
    name: data.name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    phone: data.phone || '',
    role: 'customer',
    isVerified: false,
    isEmailVerified: false,
    verificationTokenHash,
    verificationTokenExpiresAt: verificationExpiresAt,
    lastVerificationEmailSentAt: now,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const { _id, ...mongoUser } = newUser;
    const doc = await UserModel.create(mongoUser);
    newUser._id = doc._id.toString();
  } catch (err) {
    console.warn('MongoDB User save notice:', (err as Error).message);
  }

  db.users.push(newUser);

  // Send branded verification email via Gmail SMTP
  let emailResult: Awaited<ReturnType<typeof sendVerificationEmail>> = { success: true };
  try {
    emailResult = await sendVerificationEmail(cleanEmail, newUser.name, rawVerificationToken);
  } catch (err) {
    console.error('Failed to send verification email on registration:', err);
  }

  const token = generateToken(newUser);
  const { password, verificationTokenHash: _h, ...safeUser } = newUser;

  return {
    user: safeUser,
    token,
    requiresVerification: true,
    message: 'Account created! Please check your email to verify your account.',
    previewVerifyLink: emailResult?.previewLink,
  };
}

export async function verifyEmailWithToken(rawToken: string) {
  if (!rawToken || typeof rawToken !== 'string') {
    return { error: 'Invalid or missing verification token.' };
  }

  const db = await connectDB();
  const tokenHash = hashToken(rawToken);

  // Find user by verificationTokenHash
  let user = db.users.find((u) => u.verificationTokenHash === tokenHash);
  if (!user) {
    try {
      const doc = await UserModel.findOne({ verificationTokenHash: tokenHash });
      if (doc) {
        user = db.users.find((u) => u.email === doc.email) || (doc.toObject() as any);
      }
    } catch {}
  }

  if (!user) {
    return {
      error: 'Invalid or already-used verification link. Please sign in or request a new verification email.',
    };
  }

  // Check expiration
  if (user.verificationTokenExpiresAt && new Date(user.verificationTokenExpiresAt) < new Date()) {
    return {
      error: 'This verification link has expired. Please request a new verification email below.',
      expired: true,
      email: user.email,
    };
  }

  // Invalidate token (single-use) and mark email verified
  user.isVerified = true;
  user.isEmailVerified = true;
  user.verificationTokenHash = null;
  user.verificationTokenExpiresAt = null;
  user.updatedAt = new Date().toISOString();

  try {
    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        isVerified: true,
        isEmailVerified: true,
        verificationTokenHash: null,
        verificationTokenExpiresAt: null,
      }
    );
  } catch (err) {
    console.error('Error updating verification status in Mongo:', err);
  }

  return {
    success: true,
    message: 'Your email address has been successfully verified! You can now access all PetWorld features.',
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: true,
      isEmailVerified: true,
    },
  };
}

export async function resendVerificationEmail(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  const db = await connectDB();
  const cleanEmail = email.toLowerCase().trim();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    try {
      const doc = await UserModel.findOne({ email: cleanEmail });
      if (doc) {
        user = doc.toObject() as any;
      }
    } catch {}
  }

  // Prevent leaking account existence if non-existent
  if (!user) {
    return {
      success: true,
      message: 'If an unverified account exists with this email, a new verification link has been sent.',
    };
  }

  if (user.isEmailVerified || (user.isVerified && !user.verificationTokenHash)) {
    return {
      success: true,
      alreadyVerified: true,
      message: 'Your email address is already verified. You can log in right away!',
    };
  }

  // Rate limiting: 60-second cooldown
  if (user.lastVerificationEmailSentAt) {
    const elapsedSeconds = (Date.now() - new Date(user.lastVerificationEmailSentAt).getTime()) / 1000;
    if (elapsedSeconds < 60) {
      const waitSeconds = Math.ceil(60 - elapsedSeconds);
      return {
        error: `Please wait ${waitSeconds} seconds before requesting another verification email.`,
      };
    }
  }

  const rawVerificationToken = generateCryptoToken();
  const tokenHash = hashToken(rawVerificationToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  user.verificationTokenHash = tokenHash;
  user.verificationTokenExpiresAt = expiresAt;
  user.lastVerificationEmailSentAt = now;
  user.updatedAt = now;

  try {
    await UserModel.findOneAndUpdate(
      { email: cleanEmail },
      {
        verificationTokenHash: tokenHash,
        verificationTokenExpiresAt: expiresAt,
        lastVerificationEmailSentAt: now,
      }
    );
  } catch {}

  const sendResult = await sendVerificationEmail(cleanEmail, user.name, rawVerificationToken);

  return {
    success: true,
    message: 'A new verification link has been dispatched to your email address.',
    previewVerifyLink: sendResult.previewLink,
  };
}

export async function requestPasswordReset(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  const db = await connectDB();
  const cleanEmail = email.toLowerCase().trim();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    try {
      const doc = await UserModel.findOne({ email: cleanEmail });
      if (doc) {
        user = doc.toObject() as any;
      }
    } catch {}
  }

  // Security: Always return generic success to prevent email enumeration
  if (!user) {
    return {
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
    };
  }

  // Rate limiting: 60-second cooldown
  if (user.lastPasswordResetSentAt) {
    const elapsedSeconds = (Date.now() - new Date(user.lastPasswordResetSentAt).getTime()) / 1000;
    if (elapsedSeconds < 60) {
      const waitSeconds = Math.ceil(60 - elapsedSeconds);
      return {
        error: `Please wait ${waitSeconds} seconds before requesting another reset email.`,
      };
    }
  }

  // Generate crypto token & store only its SHA-256 hash
  const rawResetToken = generateCryptoToken();
  const resetTokenHash = hashToken(rawResetToken);
  const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  const now = new Date().toISOString();

  user.resetPasswordTokenHash = resetTokenHash;
  user.resetPasswordExpiresAt = resetExpiresAt;
  user.lastPasswordResetSentAt = now;
  user.updatedAt = now;

  try {
    await UserModel.findOneAndUpdate(
      { email: cleanEmail },
      {
        resetPasswordTokenHash: resetTokenHash,
        resetPasswordExpiresAt: resetExpiresAt,
        lastPasswordResetSentAt: now,
      }
    );
  } catch (err) {
    console.warn('MongoDB reset token save notice:', (err as Error).message);
  }

  const sendResult = await sendPasswordResetEmail(cleanEmail, user.name, rawResetToken);

  return {
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.',
    previewLink: sendResult.previewLink,
  };
}

export async function resetPasswordWithToken(rawToken: string, newPass: string) {
  if (!rawToken || typeof rawToken !== 'string') {
    return { error: 'Invalid or missing reset token.' };
  }

  if (!newPass || newPass.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const db = await connectDB();
  const tokenHash = hashToken(rawToken);

  // Find user by resetPasswordTokenHash
  let user = db.users.find((u) => u.resetPasswordTokenHash === tokenHash);
  if (!user) {
    try {
      const doc = await UserModel.findOne({ resetPasswordTokenHash: tokenHash });
      if (doc) {
        user = db.users.find((u) => u.email === doc.email) || (doc.toObject() as any);
      }
    } catch {}
  }

  if (!user) {
    return { error: 'Invalid or already-used password reset link. Please request a new link.' };
  }

  // Check expiration (1 hour)
  if (user.resetPasswordExpiresAt && new Date(user.resetPasswordExpiresAt) < new Date()) {
    return { error: 'This password reset link has expired. Please request a new one.' };
  }

  const hashedPassword = await hashPassword(newPass);

  // Invalidate token (single-use)
  user.password = hashedPassword;
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  user.updatedAt = new Date().toISOString();

  try {
    await UserModel.findOneAndUpdate(
      { email: user.email },
      {
        password: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      }
    );
  } catch (err) {
    console.error('MongoDB password update error:', err);
  }

  return {
    success: true,
    message: 'Your password has been successfully updated! You can now log in with your new credentials.',
  };
}

// Coupons
export async function validateCoupon(code: string, currentTotal: number) {
  const db = await connectDB();
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive
  );
  if (!coupon) {
    return { error: 'Invalid or expired coupon code' };
  }
  if (coupon.minSpend && currentTotal < coupon.minSpend) {
    return {
      error: `Coupon requires a minimum purchase of $${coupon.minSpend.toFixed(2)}`,
    };
  }

  const discount = Number(((currentTotal * coupon.discountPercent) / 100).toFixed(2));
  return {
    valid: true,
    discount,
    discountPercent: coupon.discountPercent,
    code: coupon.code,
  };
}

// Newsletter & Contact
export async function subscribeNewsletter(email: string) {
  const db = await connectDB();
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  const existing = db.subscribers.find((s) => s.email === cleanEmail);
  if (!existing) {
    db.subscribers.push({
      _id: `sub-${Date.now()}`,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    });
    try {
      await SubscriberModel.findOneAndUpdate(
        { email: cleanEmail },
        { email: cleanEmail },
        { upsert: true }
      );
    } catch {}
  }
  return { success: true, message: 'Welcome to the PetWorld family!' };
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const db = await connectDB();
  db.messages.unshift({
    _id: `msg-${Date.now()}`,
    name: data.name,
    email: data.email,
    subject: data.subject || 'General Inquiry',
    message: data.message,
    createdAt: new Date().toISOString(),
    read: false,
  });

  try {
    await ContactMessageModel.create(data);
  } catch {}

  return { success: true, message: 'Your message has been sent to our support team.' };
}

// Admin Stats
export async function getAdminDashboardStats() {
  const db = await connectDB();
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter((u) => u.role === 'customer').length;
  const totalProducts = db.products.length;
  const pendingOrders = db.orders.filter((o) => o.status === 'pending').length;
  const completedOrders = db.orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = db.products.filter((p) => p.stock <= 5).length;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    recentOrders: db.orders.slice(0, 5),
    bestSellers: db.products.filter((p) => p.isBestSeller),
  };
}
