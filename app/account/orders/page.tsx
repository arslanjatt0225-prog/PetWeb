'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useAuth } from '@/PetWorld/FrontEnd/context/AuthContext';
import { IOrder } from '@/PetWorld/Backend/types';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const url = user?._id ? `/api/orders?userId=${user._id}` : '/api/orders';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const getStatusBadge = (status: IOrder['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/account" className="flex items-center gap-1 hover:text-[#277438]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Account
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Order History</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-8">
          Review recent purchases, delivery milestones, and order receipts.
        </p>

        {loading ? (
          <div className="p-12 text-center text-stone-500">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">No orders placed yet</h3>
            <p className="text-xs text-stone-500">
              Browse our catalog of nutritious food, cozy beds, and fun toys!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#113d22] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1a532d]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold text-stone-500">Order Reference</span>
                    <h3 className="text-base font-black text-stone-900">{order.orderNumber}</h3>
                    <span className="text-[11px] text-stone-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-black text-[#113d22]">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/60"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Meta */}
                <div className="flex flex-col sm:flex-row justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 gap-2">
                  <p>
                    <strong>Destination:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                  <p>
                    <strong>Payment:</strong>{' '}
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
