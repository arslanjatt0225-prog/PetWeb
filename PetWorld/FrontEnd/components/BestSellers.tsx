'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { IProduct } from '@/PetWorld/Backend/types';

interface BestSellersProps {
  products: IProduct[];
}

export function BestSellers({ products }: BestSellersProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Pick top 6 best sellers matching screenshot
  const displayProducts = products.filter((p) => p.isBestSeller).slice(0, 6);

  return (
    <section className="w-full py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-[2px] bg-[#277438]" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#277438] uppercase">
                Our Best Sellers
              </span>
              <span className="w-6 h-[2px] bg-[#277438]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Popular Pet Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-700 hover:text-[#277438] transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {displayProducts.map((product, index) => {
            const inWishlist = isInWishlist(product._id);

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
              >
                {/* Wishlist Button with Motion */}
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'bg-red-50 text-red-500 shadow-xs'
                      : 'bg-white/80 text-stone-400 hover:text-red-500 hover:bg-white shadow-xs'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`}
                  />
                </motion.button>

                {/* Clickable Card Content */}
                <Link href={`/product/${product.slug || product._id}`} className="block">
                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 mb-3 flex items-center justify-center p-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#277438] transition-colors mb-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                </Link>

                {/* Bottom Row: Price & Orange Circular Cart Button */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-extrabold text-stone-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-500">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-stone-500">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Orange Cart Action Button with Motion Feedback */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => addToCart(product, 1)}
                    className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-[#f58220] hover:bg-[#e06f10] text-white shadow-md shadow-orange-500/25 transition-all"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
