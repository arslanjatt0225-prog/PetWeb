'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { useCart } from '@/PetWorld/FrontEnd/context/CartContext';
import { useWishlist } from '@/PetWorld/FrontEnd/context/WishlistContext';
import { IProduct } from '@/PetWorld/Backend/types';
import {
  Star,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<IProduct[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);

          // Fetch related
          const relRes = await fetch(`/api/products?category=${data.product.categorySlug}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelated(relData.products.filter((p: IProduct) => p._id !== data.product._id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto p-12 text-center text-stone-500">
          Loading product details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <Link href="/shop" className="text-[#277438] underline text-sm">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/shop" className="flex items-center gap-1 hover:text-[#277438]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 p-6 flex items-center justify-center">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                referrerPolicy="no-referrer"
                priority
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-stone-50 border-2 shrink-0 ${
                      selectedImage === img ? 'border-[#277438]' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i}`}
                      fill
                      className="object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#277438] uppercase tracking-wider block mb-1">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {product.rating}
                </span>
                <span className="text-xs text-stone-400">
                  ({product.reviewCount || 120} Customer Reviews)
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-stone-100">
              <span className="text-3xl font-black text-stone-900">
                ${product.price.toFixed(2)}
              </span>
              {product.salePrice && product.salePrice > product.price && (
                <span className="text-lg text-stone-400 line-through">
                  ${product.salePrice.toFixed(2)}
                </span>
              )}
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  product.inStock
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.inStock ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Key Features */}
            {product.features && (
              <div className="space-y-2 py-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Product Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#277438] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-[#f58220] hover:bg-[#e06f10] text-white font-bold text-sm py-3 px-6 rounded-full shadow-lg shadow-orange-500/25 hover:scale-102 active:scale-98 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart (${(product.price * quantity).toFixed(2)})</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-full border transition-all ${
                    inWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-stone-300 text-stone-500 hover:border-red-500 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Direct Buy Now with Cash On Delivery */}
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  router.push('/checkout');
                }}
                className="w-full bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-xs sm:text-sm py-3 rounded-full transition-all shadow-md"
              >
                Instant Buy with Cash on Delivery
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="pt-4 grid grid-cols-2 gap-3 text-[11px] text-stone-600 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#277438]" />
                <span>Fast nationwide dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#277438]" />
                <span>100% Pet Happiness Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              You Might Also Love
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/product/${rel.slug || rel._id}`}
                  className="bg-white border border-stone-200 rounded-2xl p-3.5 hover:shadow-lg transition-all"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2 p-2">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 truncate mb-1">
                    {rel.name}
                  </h4>
                  <span className="text-sm font-extrabold text-[#113d22]">
                    ${rel.price.toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
