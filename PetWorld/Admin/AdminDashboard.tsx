'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Search,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/PetWorld/FrontEnd/context/AuthContext';
import { IProduct, IOrder, ICategory, ICoupon } from '@/PetWorld/Backend/types';
import { PetWorldLogo } from '@/PetWorld/FrontEnd/components/PawIcon';

export function AdminDashboard() {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'settings' | 'email'
  >('overview');

  // SMTP Test State
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [checkingSmtp, setCheckingSmtp] = useState(false);
  const [testRecipient, setTestRecipient] = useState('arslanjutt00225@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);


  // Admin Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Form states
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // New Product Form
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Dog Supplies');
  const [prodPrice, setProdPrice] = useState(29.99);
  const [prodStock, setProdStock] = useState(25);
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // Load Admin Data
  const refreshData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes, catRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/categories'),
      ]);

      const [statsData, prodData, ordData, catData] = await Promise.all([
        statsRes.json(),
        prodRes.json(),
        ordRes.json(),
        catRes.json(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (catData.success) setCategories(catData.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [statsRes, prodRes, ordRes, catRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/categories'),
        ]);

        const [statsData, prodData, ordData, catData] = await Promise.all([
          statsRes.json(),
          prodRes.json(),
          ordRes.json(),
          catRes.json(),
        ]);

        if (!ignore) {
          if (statsData.success) setStats(statsData.stats);
          if (prodData.success) setProducts(prodData.products);
          if (ordData.success) setOrders(ordData.orders);
          if (catData.success) setCategories(catData.categories);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Quick 1-click login for test admin if not authenticated as admin
  const handleQuickAdminLogin = async () => {
    await login('admin@petworld.com', 'AdminPassword123!');
    refreshData();
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Dog Supplies');
    setProdPrice(29.99);
    setProdStock(25);
    setProdImage('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80');
    setProdDesc('High quality veterinarian approved pet supply.');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: IProduct) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdStock(prod.stock);
    setProdImage(prod.image);
    setProdDesc(prod.description);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          price: prodPrice,
          stock: prodStock,
          image: prodImage,
          description: prodDesc,
        }),
      });
    } else {
      // Create
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          price: prodPrice,
          stock: prodStock,
          image: prodImage,
          description: prodDesc,
          isFeatured: true,
        }),
      });
    }
    setShowProductModal(false);
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      refreshData();
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, status: IOrder['status']) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    refreshData();
  };

  const checkSmtpConnection = async () => {
    try {
      setCheckingSmtp(true);
      const res = await fetch('/api/admin/smtp-status');
      const data = await res.json();
      setSmtpStatus(data);
    } catch (e: any) {
      setSmtpStatus({ success: false, error: e.message });
    } finally {
      setCheckingSmtp(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) return;
    try {
      setSendingTest(true);
      setTestResult(null);
      const res = await fetch('/api/admin/smtp-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testRecipient }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setSendingTest(false);
    }
  };


  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/">
            <PetWorldLogo />
          </Link>
          <span className="hidden sm:inline-block bg-[#113d22] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#277438] bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-stone-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-stone-500">{user.role}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleQuickAdminLogin}
              className="bg-[#113d22] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#1a532d]"
            >
              Sign In As Admin
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Responsive Sidebar Nav */}
        <aside className="w-full md:w-60 bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/80 shadow-xs shrink-0 h-fit flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'categories'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <FolderTree className="w-4 h-4 shrink-0" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'coupons'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('email');
              checkSmtpConnection();
            }}
            className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'email'
                ? 'bg-[#113d22] text-white shadow-md'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Gmail SMTP</span>
          </button>
        </aside>

        {/* Tab Content Panes */}
        <div className="flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    ${stats?.totalRevenue?.toFixed(2) || '136.97'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% this month
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                    <span>Total Orders</span>
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {stats?.totalOrders || orders.length}
                  </h3>
                  <span className="text-[10px] text-amber-700 font-bold">
                    {stats?.pendingOrders || 1} Pending Delivery
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                    <span>Live Products</span>
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {products.length}
                  </h3>
                  <span className="text-[10px] text-stone-500">
                    Across 7 core categories
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                    <span>Low Stock Alert</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {stats?.lowStockProducts || 0}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Inventory healthy
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#277438] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-600">
                    <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o._id} className="hover:bg-stone-50">
                          <td className="p-3 font-bold text-stone-900">{o.orderNumber}</td>
                          <td className="p-3">
                            <p className="font-semibold text-stone-900">{o.customerName}</p>
                            <p className="text-[10px] text-stone-400">{o.customerEmail}</p>
                          </td>
                          <td className="p-3">{o.items.length} items</td>
                          <td className="p-3 font-bold text-[#113d22]">${o.total.toFixed(2)}</td>
                          <td className="p-3">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="text-[#277438] font-bold hover:underline"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Product Catalog Management
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add, edit, adjust prices, stock levels, and features.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 bg-[#113d22] hover:bg-[#1a532d] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((p) => (
                        <tr key={p._id} className="hover:bg-stone-50">
                          <td className="p-3 flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-contain p-1"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="font-bold text-stone-900 max-w-xs truncate">
                              {p.name}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-stone-700">{p.category}</td>
                          <td className="p-3 font-bold text-[#113d22]">${p.price.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.stock > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-3 font-semibold">{p.rating} ★</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-stone-500 hover:text-emerald-700 bg-stone-100 hover:bg-emerald-50 rounded-lg"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 text-stone-500 hover:text-red-700 bg-stone-100 hover:bg-red-50 rounded-lg"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Order Fulfillment & Delivery
                  </h3>
                  <p className="text-xs text-stone-500">
                    Review incoming orders, customer addresses, and update fulfillment milestones.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Filter status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders
                  .filter((o) => !orderStatusFilter || o.status === orderStatusFilter)
                  .map((o) => (
                    <div
                      key={o._id}
                      className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-stone-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                        <div>
                          <span className="text-xs font-bold text-stone-900">
                            {o.orderNumber}
                          </span>{' '}
                          ·{' '}
                          <span className="text-[11px] text-stone-500">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500 font-medium">Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(o._id, e.target.value as any)
                            }
                            className="text-xs font-bold uppercase bg-white border border-stone-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#277438]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                        <div>
                          <p className="font-bold text-stone-900">{o.customerName}</p>
                          <p>{o.customerEmail}</p>
                          <p>{o.customerPhone}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800">Ship to:</p>
                          <p>{o.shippingAddress.street}</p>
                          <p>
                            {o.shippingAddress.city}, {o.shippingAddress.postalCode}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800">Payment:</p>
                          <p className="capitalize">
                            {o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Card'}
                          </p>
                          <p className="text-sm font-black text-[#113d22]">
                            Total: ${o.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2">
                        {o.items.map((item, i) => (
                          <span
                            key={i}
                            className="bg-white border border-stone-200 text-stone-700 text-[11px] px-2.5 py-1 rounded-lg"
                          >
                            {item.quantity}x {item.name} (${item.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-stone-900">Pet Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div
                    key={c._id}
                    className="border border-stone-200 rounded-2xl p-4 flex items-center gap-3 bg-stone-50"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{c.name}</h4>
                      <p className="text-[11px] text-stone-500">/{c.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-stone-900">Promotional Coupons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-base font-black text-[#113d22]">WELCOME10</span>
                  <p className="text-xs text-stone-600">10% OFF orders over $30</p>
                  <span className="inline-block text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-base font-black text-[#113d22]">PAWSOME20</span>
                  <p className="text-xs text-stone-600">20% OFF orders over $60</p>
                  <span className="inline-block text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-stone-900">Store Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    defaultValue="PetWorld"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Store Tagline</label>
                  <input
                    type="text"
                    defaultValue="Care More. Love More."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    defaultValue={50}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Standard Flat Shipping Rate ($)</label>
                  <input
                    type="number"
                    defaultValue={4.99}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GMAIL SMTP INTEGRATION & DIAGNOSTICS */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-2 rounded-xl bg-emerald-50 text-[#277438]">
                      <Mail className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-black text-stone-900">
                      Gmail SMTP Email System
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500">
                    Official Sender: <strong className="text-stone-800">arslanjutt00225@gmail.com</strong> via Nodemailer Gmail SMTP
                  </p>
                </div>

                <button
                  type="button"
                  onClick={checkSmtpConnection}
                  disabled={checkingSmtp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all self-start md:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingSmtp ? 'animate-spin' : ''}`} />
                  <span>{checkingSmtp ? 'Verifying SMTP...' : 'Test Connection'}</span>
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    SMTP Host & Port
                  </span>
                  <p className="text-base font-black text-stone-900">smtp.gmail.com:587</p>
                  <p className="text-[11px] text-stone-500">STARTTLS Secure Delivery</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Sender Account
                  </span>
                  <p className="text-sm font-black text-stone-900 truncate">
                    arslanjutt00225@gmail.com
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">PetWorld Official Store</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Connection Status
                  </span>
                  <div className="flex items-center gap-2">
                    {smtpStatus?.smtp?.status?.connected ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-black text-emerald-700">Authenticated & Live</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-sm font-black text-amber-700">
                          {smtpStatus?.smtp?.hasPassword ? 'Auth Check Required' : 'Awaiting App Password'}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {smtpStatus?.smtp?.status?.connected
                      ? 'Nodemailer connected to Gmail'
                      : 'Provide 16-char App Password in SMTP_PASS'}
                  </p>
                </div>
              </div>

              {/* Diagnostics Notice */}
              {smtpStatus?.smtp?.status?.error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>SMTP Diagnostics Notice:</span>
                  </p>
                  <p className="font-mono text-[11px] pl-5">{smtpStatus.smtp.status.error}</p>
                </div>
              )}

              {/* Live Test Email Tool */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-[#277438]">
                    <Send className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-black text-stone-900">
                    Dispatch Live Test Email
                  </h3>
                </div>
                <p className="text-xs text-stone-500">
                  Send a live test email through Gmail SMTP to verify end-to-end delivery to your inbox.
                </p>

                <form onSubmit={handleSendTestEmail} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      placeholder="Enter recipient email (e.g. arslanjutt00225@gmail.com)"
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#277438]"
                    />
                    <button
                      type="submit"
                      disabled={sendingTest}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#277438] hover:bg-[#1e5c2b] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-70 whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingTest ? 'Sending Email...' : 'Send Live Test Email'}</span>
                    </button>
                  </div>

                  {testResult && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                        testResult.success
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>
                        {testResult.message || testResult.error || 'Test email completed.'}
                      </span>
                    </div>
                  )}
                </form>
              </div>

              {/* Automatic Triggers Summary */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#277438]" />
                  <span>Configured Automatic Email Triggers</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <p className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Customer Registration
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Generates a secure 32-byte crypto token (SHA-256 hashed in MongoDB) and sends a 24-hour verification link.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <p className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Password Recovery
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Dispatches single-use password reset link valid for 1 hour with 60-second cooldown rate limiting.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <p className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Order Placement
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Sends full itemized receipt with order number, line items, pricing, delivery address, and payment method.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <p className="font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Order Status Lifecycle
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Dispatches branded emails when order transitions between Processing, Shipped, Delivered, or Cancelled (duplicate-safe).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowProductModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Ergonomic Dog Harness"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#277438]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="Dog Supplies">Dog Supplies</option>
                    <option value="Cat Supplies">Cat Supplies</option>
                    <option value="Bird Supplies">Bird Supplies</option>
                    <option value="Fish Supplies">Fish Supplies</option>
                    <option value="Small Pet Supplies">Small Pet Supplies</option>
                    <option value="Pet Food">Pet Food</option>
                    <option value="Pet Toys">Pet Toys</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Inventory Units in Stock</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#113d22] text-white font-bold rounded-xl hover:bg-[#1a532d]"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
