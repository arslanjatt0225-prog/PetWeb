'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { PawIcon } from './PawIcon';

export function PromoBanner() {
  const highlights = [
    'Healthy Products',
    'Trusted Brands',
    'Best Prices',
  ];

  return (
    <section className="w-full py-6 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl bg-[#103b22] text-white overflow-hidden shadow-xl"
        >
          {/* Decorative Floating Paw Print Watermarks */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-12, -6, -12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 left-1/3 text-emerald-700/30 pointer-events-none"
          >
            <PawIcon className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [45, 50, 45] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-4 right-1/4 text-emerald-700/30 pointer-events-none"
          >
            <PawIcon className="w-20 h-20" />
          </motion.div>
          <div className="absolute top-4 right-6 text-emerald-700/40 pointer-events-none rotate-12">
            <PawIcon className="w-24 h-24" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-6 z-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
              >
                Premium Care <br />
                for Your Pet
              </motion.h2>

              {/* Checklist */}
              <div className="space-y-3">
                {highlights.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#38a154] text-white shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-emerald-50">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Pill Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-2"
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2.5 bg-white text-stone-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right Pets Photography */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-96 w-full flex items-center justify-center overflow-hidden">
              <Image
                src="/images/promo_pets_banner.jpg"
                alt="Tabby cat and happy smiling terrier puppy resting together"
                fill
                className="object-cover object-center lg:object-right scale-102 hover:scale-106 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Organic gradient blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#103b22] via-[#103b22]/30 to-transparent lg:block hidden pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#103b22] via-transparent to-transparent lg:hidden block pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
