'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, Heart } from 'lucide-react';
import { PawIcon } from './PawIcon';

export function HeroSection() {
  return (
    <section className="relative w-full bg-[#fbf9f4] overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Animated Floating Decorative Paw Prints */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-12, -6, -12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-4 sm:left-10 pointer-events-none opacity-20 text-[#277438]"
      >
        <PawIcon className="w-14 h-14 sm:w-18 sm:h-18" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [45, 52, 45] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-12 left-1/3 pointer-events-none opacity-15 text-[#277438]"
      >
        <PawIcon className="w-10 h-10 sm:w-14 sm:h-14" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-8 left-1/4 pointer-events-none opacity-20 text-[#277438]"
      >
        <PawIcon className="w-16 h-16 sm:w-20 sm:h-20" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0], rotate: [-45, -38, -45] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-6 right-4 sm:right-12 pointer-events-none opacity-20 text-[#277438]"
      >
        <PawIcon className="w-20 h-20 sm:w-24 sm:h-24" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-2.5 sm:gap-3"
            >
              <span className="text-xs sm:text-sm font-black tracking-widest text-[#1a532d] uppercase">
                PREMIUM PET SUPPLIES
              </span>
              <span className="w-10 sm:w-14 h-[2px] bg-[#1a532d]" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 leading-[1.08] tracking-tight"
            >
              Happy Pets. <br />
              <span className="text-[#277438]">Healthy Life.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-stone-600 max-w-md font-normal leading-relaxed"
            >
              Premium quality pet products for your furry friends.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-2 flex flex-wrap gap-4 items-center"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/shop?category=pet-food"
                className="inline-flex items-center gap-2 text-stone-700 hover:text-[#277438] font-bold text-xs sm:text-sm px-5 py-3 rounded-full border border-stone-300 hover:border-[#277438] bg-white transition-all shadow-xs"
              >
                <span>Explore Nutrition</span>
              </Link>
            </motion.div>

            {/* 3 Value Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-stone-200/90 text-stone-800"
            >
              {/* Feature 1 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-[#277438] shrink-0">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight">
                    Free Shipping
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-500">
                    On Orders Over $50
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-[#277438] shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight">
                    Secure
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-500">
                    Payments
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-[#277438] shrink-0">
                  <PawIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#277438]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-tight">
                    24/7
                  </h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-500">
                    Support
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Pets Arch Photography */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end pt-4 sm:pt-0"
          >
            {/* Top Right Decorative Script Quote matching screenshot */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 sm:-top-7 right-4 sm:right-10 z-20 flex flex-col items-end pointer-events-none"
            >
              <span className="font-serif italic text-base sm:text-2xl text-stone-900 font-bold tracking-wide drop-shadow-xs">
                Because
              </span>
              <span className="font-serif italic text-base sm:text-2xl text-stone-900 font-bold tracking-wide drop-shadow-xs">
                They Deserve
              </span>
              <span className="font-serif italic text-base sm:text-2xl text-stone-900 font-bold tracking-wide flex items-center gap-1.5 drop-shadow-xs">
                the Best{' '}
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block text-red-500 not-italic text-lg sm:text-xl"
                >
                  ❤️
                </motion.span>
              </span>
            </motion.div>

            {/* Organic Arch Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] h-[350px] sm:h-[440px] md:h-[490px]">
              {/* Outer Organic Green Ring & Backdrop */}
              <div className="absolute inset-0 rounded-t-[170px] sm:rounded-t-[200px] rounded-b-[40px] border-4 border-[#277438] bg-[#eef7f0] -rotate-1 transform scale-[1.02] shadow-2xl transition-transform hover:scale-[1.03] duration-500" />

              {/* Inner Arch with Cute Puppy & Kitten Photography */}
              <div className="relative w-full h-full rounded-t-[166px] sm:rounded-t-[196px] rounded-b-[36px] overflow-hidden border-2 border-emerald-800/10 bg-white">
                <Image
                  src="/images/hero_puppy_and_kitten.jpg"
                  alt="Adorable Golden Retriever puppy and cute striped tabby kitten sitting together"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-106 transition-transform duration-700"
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 500px"
                />

                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
