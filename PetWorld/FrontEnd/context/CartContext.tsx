'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, IProduct } from '@/PetWorld/Backend/types';

interface CartContextType {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('petworld_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const saved = localStorage.getItem('petworld_coupon');
      if (saved) return JSON.parse(saved).code || '';
    } catch {
      // ignore
    }
    return '';
  });

  const [discountPercent, setDiscountPercent] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem('petworld_coupon');
      if (saved) return JSON.parse(saved).percent || 0;
    } catch {
      // ignore
    }
    return 0;
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('petworld_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [items]);

  const addToCart = (product: IProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    localStorage.removeItem('petworld_cart');
    localStorage.removeItem('petworld_coupon');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 4.99;
  const discount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Number((subtotal - discount + (subtotal > 0 ? shipping : 0)).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, total: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode(data.code);
        setDiscountPercent(data.discountPercent);
        localStorage.setItem(
          'petworld_coupon',
          JSON.stringify({ code: data.code, percent: data.discountPercent })
        );
        return { success: true, message: `Coupon ${data.code} applied: ${data.discountPercent}% OFF!` };
      }
      return { success: false, message: data.error || 'Invalid coupon code' };
    } catch {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    localStorage.removeItem('petworld_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shipping,
        total,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
