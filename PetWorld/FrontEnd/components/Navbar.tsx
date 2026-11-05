'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  ShieldCheck,
  Headphones,
  ChevronDown,
  Menu,
  X,
  Heart,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { PawIcon, PetWorldLogo } from './PawIcon';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout, setIsAuthModalOpen, setAuthModalTab } = useAuth();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'All Products', href: '/shop' },
    { name: 'Dog Supplies', href: '/shop?category=dog-supplies' },
    { name: 'Cat Supplies', href: '/shop?category=cat-supplies' },
    { name: 'Bird Supplies', href: '/shop?category=bird-supplies' },
    { name: 'Fish Supplies', href: '/shop?category=fish-supplies' },
    { name: 'Small Pet Supplies', href: '/shop?category=small-pet-supplies' },
    { name: 'Pet Food', href: '/shop?category=pet-food' },
    { name: 'Pet Toys', href: '/shop?category=pet-toys' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="w-full bg-[#113d22] text-white text-[11px] sm:text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-around gap-2 text-emerald-100 font-medium">
          <div className="flex items-center gap-1.5">
            <PawIcon className="w-3.5 h-3.5 text-[#38a154]" />
            <span>Free Shipping on Orders Over $50</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 border-x border-emerald-800/60 px-6">
            <ShieldCheck className="w-3.5 h-3.5 text-[#38a154]" />
            <span>100% Pet Happiness Guarantee</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#38a154]" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <PetWorldLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-800">
          <Link
            href="/"
            className={`relative py-1 transition-colors hover:text-[#277438] ${
              pathname === '/' ? 'text-[#277438]' : ''
            }`}
          >
            Home
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#277438] rounded-full" />
            )}
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button
              onClick={() => router.push('/shop')}
              className={`flex items-center gap-1 py-1 transition-colors hover:text-[#277438] ${
                pathname.startsWith('/shop') ? 'text-[#277438]' : ''
              }`}
            >
              Shop
              <ChevronDown className="w-4 h-4 text-stone-500" />
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-[#eaf4ed] hover:text-[#1e612f] transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`py-1 transition-colors hover:text-[#277438] ${
              pathname === '/about' ? 'text-[#277438]' : ''
            }`}
          >
            About
          </Link>

          <Link
            href="/blog"
            className={`py-1 transition-colors hover:text-[#277438] ${
              pathname.startsWith('/blog') ? 'text-[#277438]' : ''
            }`}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`py-1 transition-colors hover:text-[#277438] ${
              pathname === '/contact' ? 'text-[#277438]' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Search Bar matching screenshot */}
        <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pets supplies..."
              className="w-full bg-stone-50 border border-stone-200/90 rounded-full py-2 pl-4 pr-10 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#277438] focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#277438] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Actions: Account & Cart Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative p-2 text-stone-600 hover:text-red-500 transition-colors hidden md:block"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Button / Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (user) {
                  setUserDropdownOpen(!userDropdownOpen);
                } else {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 transition-colors overflow-hidden"
              aria-label="User Account"
            >
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {/* Account Popover Menu */}
            {user && userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-stone-100 py-2 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Administrator
                    </span>
                  )}
                </div>

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/account"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>

                <Link
                  href="/account/orders"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon with Animated Red Badge */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-700 hover:text-[#277438] transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <motion.span
              key={itemCount}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#f13a3a] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
            >
              {itemCount}
            </motion.span>
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-stone-700 hover:text-emerald-700 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#277438]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t border-stone-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 overflow-hidden shadow-xl"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pets supplies..."
                className="w-full bg-stone-100 border border-stone-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#277438] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#277438]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col space-y-2 text-sm font-semibold text-stone-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/'
                    ? 'bg-[#113d22] text-white font-bold'
                    : 'hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/shop'
                    ? 'bg-[#113d22] text-white font-bold'
                    : 'hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Shop All Products
              </Link>

              {/* Mobile Category Chips */}
              <div className="py-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-3 mb-1.5">
                  Browse by Category
                </span>
                <div className="grid grid-cols-2 gap-1.5 pl-2">
                  {categories.slice(1).map((c) => (
                    <Link
                      key={c.name}
                      href={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-emerald-50 hover:text-[#277438] transition-colors"
                    >
                      • {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                About PetWorld
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                Pet Wellness Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between"
              >
                <span>Saved Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
