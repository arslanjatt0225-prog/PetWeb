'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useCart } from '@/PetWorld/FrontEnd/context/CartContext';
import { useAuth } from '@/PetWorld/FrontEnd/context/AuthContext';
import {
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  Tag,
  ArrowRight,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('54000');
  const [country, setCountry] = useState('Pakistan');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone || !street || !city) {
      setErrorMsg('Please fill in all required shipping fields');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        userId: user?._id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: { street, city, postalCode, country },
        items,
        subtotal,
        discount,
        shippingCost: shipping,
        total,
        paymentMethod,
        couponCode: couponCode || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.order) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to place order');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error while processing order');
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#277438] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-stone-900">
              Order Confirmed! 🎉
            </h1>
            <p className="text-sm text-stone-600">
              Thank you, <strong>{orderSuccess.customerName}</strong>. Your order{' '}
              <strong className="text-[#277438]">{orderSuccess.orderNumber}</strong> has been received and is being prepared for fast dispatch!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 text-left space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="text-xs text-stone-500">Order Status</span>
              <span className="text-xs font-bold uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                {orderSuccess.status}
              </span>
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <p>
                <strong>Delivery Address:</strong> {orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city}
              </p>
              <p>
                <strong>Payment Method:</strong> {orderSuccess.paymentMethod === 'cod' ? 'Cash on Delivery (Pay upon receipt)' : 'Card Payment'}
              </p>
              <p>
                <strong>Total Amount:</strong> <span className="font-extrabold text-[#113d22] text-sm">${orderSuccess.total.toFixed(2)}</span>
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-stone-700 mb-2">Items Ordered:</p>
              <div className="space-y-2">
                {orderSuccess.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-stone-600">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 bg-[#113d22] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#1a532d] shadow-md"
            >
              <Package className="w-4 h-4" />
              <span>Track in My Orders</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-stone-200 text-stone-800 text-xs font-bold px-6 py-3 rounded-full hover:bg-stone-300"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // EMPTY CART GUARD
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-black text-stone-900">Your Cart is Empty</h2>
          <p className="text-xs text-stone-500">
            Please select pet supplies before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#113d22] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#1a532d]"
          >
            Explore Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <h1 className="text-3xl font-black text-stone-900 mb-8">
          Express Secure Checkout
        </h1>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Information */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                1. Customer Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (for Order Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ayesha@example.com"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                2. Shipping Destination
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address & House / Flat # *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House 42, Block B, Street 5"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lahore, Karachi..."
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="54000"
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs bg-stone-100 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                3. Payment Method
              </h3>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#277438] bg-emerald-50/50 ring-1 ring-[#277438]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#277438]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#277438]" />
                      <span className="text-xs font-bold text-stone-900">
                        Cash on Delivery (Recommended)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Pay easily with cash or local courier debit scan when your package arrives at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Online Card Option */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#277438] bg-emerald-50/50 ring-1 ring-[#277438]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-[#277438]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#277438]" />
                      <span className="text-xs font-bold text-stone-900">
                        Online Credit / Debit Card
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Verified 256-bit encrypted checkout. (Test simulator enabled for instant review).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Final Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 border-t border-stone-100 pt-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Coupon ({couponCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-[#277438]">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 border-t border-stone-200 pt-3">
                  <span>Grand Total</span>
                  <span className="text-[#113d22]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f58220] hover:bg-[#e06f10] text-white font-black text-sm py-3.5 rounded-full shadow-lg shadow-orange-500/20 hover:scale-102 active:scale-98 transition-all"
              >
                <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#277438]" />
                <span>SSL Secured & Verified 100% Pet Happiness Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
