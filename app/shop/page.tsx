'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useCart } from '@/PetWorld/FrontEnd/context/CartContext';
import { useWishlist } from '@/PetWorld/FrontEnd/context/WishlistContext';
import { IProduct } from '@/PetWorld/Backend/types';
import { ShoppingCart, Heart, Star, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<number>(100);

  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'Dog Supplies', slug: 'dog-supplies' },
    { name: 'Cat Supplies', slug: 'cat-supplies' },
    { name: 'Bird Supplies', slug: 'bird-supplies' },
    { name: 'Fish Supplies', slug: 'fish-supplies' },
    { name: 'Small Pet Supplies', slug: 'small-pet-supplies' },
    { name: 'Pet Food', slug: 'pet-food' },
    { name: 'Pet Toys', slug: 'pet-toys' },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const filteredProducts = products.filter((p) => p.price <= priceRange);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <Link href="/" className="hover:text-[#277438]">Home</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Shop</span>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-[#277438] capitalize font-semibold">
                {selectedCategory.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
          PetWorld Collection
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Showing {filteredProducts.length} premium products for your companion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#277438]" />
              Filter Products
            </h3>
            {(selectedCategory || searchQuery || priceRange < 100) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setPriceRange(100);
                  setSortBy('featured');
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search in Shop */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Keywords
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kibble, harness..."
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#277438]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Categories
            </label>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-[#113d22] text-white font-bold shadow-xs'
                      : 'text-stone-700 hover:bg-emerald-50 hover:text-[#277438]'
                  }`}
                >
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Max Price</span>
              <span className="text-[#277438]">${priceRange}</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#277438] cursor-pointer"
            />
          </div>
        </aside>

        {/* Main Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold text-stone-600">
              {filteredProducts.length} Results
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse h-64" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500 text-sm">No products matched your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setPriceRange(100);
                }}
                className="mt-3 text-xs font-bold text-[#277438] underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
              {filteredProducts.map((product) => {
                const inWishlist = isInWishlist(product._id);

                return (
                  <div
                    key={product._id}
                    className="group relative bg-white border border-stone-200/80 rounded-2xl p-3.5 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        inWishlist
                          ? 'bg-red-50 text-red-500'
                          : 'bg-white/80 text-stone-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                    </button>

                    <Link href={`/product/${product.slug || product._id}`}>
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 mb-3 p-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <span className="text-[10px] font-bold text-[#277438] uppercase tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-[#277438] transition-colors mb-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 block">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-500">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span className="text-stone-500">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f58220] hover:bg-[#e06f10] text-white shadow-md shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all duration-150"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading catalog...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
