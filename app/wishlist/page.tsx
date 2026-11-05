'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useWishlist } from '@/PetWorld/FrontEnd/context/WishlistContext';
import { useCart } from '@/PetWorld/FrontEnd/context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-black text-stone-900 mb-2">
          Your Saved Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-8">
          Items you love for your pets. Move them to your cart whenever you are ready.
        </p>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500">
              Browse products and click the heart icon to save favorites.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#113d22] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1a532d]"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 mb-3 p-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-xs text-red-500 hover:scale-110 transition-transform"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#277438] uppercase tracking-wider block mb-1">
                    {product.category}
                  </span>
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#277438] line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>
                  <span className="text-base font-extrabold text-[#113d22] block mb-3">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#f58220] hover:bg-[#e06f10] text-white font-bold text-xs py-2.5 rounded-full transition-all shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
