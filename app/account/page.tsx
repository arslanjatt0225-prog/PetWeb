'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useAuth } from '@/PetWorld/FrontEnd/context/AuthContext';
import { User, Package, MapPin, Heart, LogOut, LayoutDashboard } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, setIsAuthModalOpen, setAuthModalTab } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">Sign In to Your Account</h2>
          <p className="text-xs text-stone-500">
            Access your order history, manage saved addresses, and track your furry friend’s favorite treats.
          </p>
          <button
            onClick={() => {
              setAuthModalTab('login');
              setIsAuthModalOpen(true);
            }}
            className="inline-block bg-[#113d22] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1a532d]"
          >
            Sign In Now
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#277438] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-stone-900">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">{user.email}</p>
              <p className="text-xs text-stone-400 mt-1">{user.phone || '+92 300 0000000'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="inline-flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-4 py-2.5 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-[#277438] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#277438] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">My Orders</h3>
            <p className="text-xs text-stone-500 mt-1">
              Track active delivery statuses, past purchases, and invoices.
            </p>
          </Link>

          <Link
            href="/wishlist"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-[#277438] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Saved Wishlist</h3>
            <p className="text-xs text-stone-500 mt-1">
              Review your favorite pet supplies and move them to cart anytime.
            </p>
          </Link>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Default Address</h3>
            <p className="text-xs text-stone-600 mt-1">
              House 42, Block B, Gulberg III, Lahore, Pakistan
            </p>
            <span className="inline-block mt-3 text-[10px] font-bold text-[#277438] bg-emerald-50 px-2 py-0.5 rounded">
              Verified Delivery Address
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
