'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';

export function PetWorldProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <CartDrawer />
          <AuthModal />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
