'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setLoadingCoupon(true);
    setCouponFeedback(null);
    const res = await applyCoupon(inputCode.trim());
    setCouponFeedback(res);
    setLoadingCoupon(false);
    if (res.success) {
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900">
                Your Shopping Cart
              </h3>
              <span className="bg-[#277438] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#f0f8f2] border-b border-emerald-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1a532d] mb-1.5">
              <Truck className="w-4 h-4 text-[#277438]" />
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#277438]">${amountNeededForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>!
                </span>
              ) : (
                <span className="text-[#277438]">
                  🎉 You unlocked <strong>FREE Shipping</strong> on this order!
                </span>
              )}
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#277438] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <X className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-800">
                  Your cart is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our wholesome pet foods, durable toys, and cozy beds to spoil your furry companion.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#113d22] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1a532d]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-200/70"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200/60">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-stone-500">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-[#113d22]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 p-5 bg-stone-50 space-y-3">
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: {couponCode} (-${discount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-500 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. WELCOME10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 uppercase focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                    <button
                      type="submit"
                      disabled={loadingCoupon}
                      className="bg-[#113d22] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#1a532d] shrink-0"
                    >
                      {loadingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponFeedback.success ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-[#277438]">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-stone-300 pt-2">
                  <span>Total</span>
                  <span className="text-[#113d22]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Link Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#f58220] hover:bg-[#e06f10] text-white font-bold text-sm py-3 rounded-full shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
