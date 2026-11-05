'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { PawIcon } from './PawIcon';

interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  quote: string;
}

const TESTIMONIAL_SETS: TestimonialItem[][] = [
  [
    {
      id: '1',
      name: 'Ayesha Khan',
      city: 'Lahore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“Excellent quality products! My pets are very happy.”',
    },
    {
      id: '2',
      name: 'Usman Raza',
      city: 'Karachi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“Fast delivery and great service.”',
    },
    {
      id: '3',
      name: 'Sara Ahmed',
      city: 'Islamabad',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“Highly recommended!”',
    },
  ],
  [
    {
      id: '4',
      name: 'Dr. Hamza Tariq',
      city: 'Faisalabad',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“As a veterinarian, I truly admire their focus on clean nutrition and orthopedic beds.”',
    },
    {
      id: '5',
      name: 'Fatima Noor',
      city: 'Rawalpindi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“The automatic feeder has been a lifesaver for my busy schedule. Top notch build quality!”',
    },
    {
      id: '6',
      name: 'Bilal Shah',
      city: 'Peshawar',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: '“Prompt customer service and hassle-free Cash on Delivery. 10/10 experience.”',
    },
  ],
];

export function Testimonials() {
  const [activeSet, setActiveSet] = useState(0);

  return (
    <section className="relative w-full py-12 lg:py-16 bg-[#fbf9f4] overflow-hidden">
      {/* Decorative Outer Paw Prints matching screenshot */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-12, -6, -12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-[#277438]/20 pointer-events-none"
      >
        <PawIcon className="w-16 h-16 sm:w-20 sm:h-20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-[#277438]/20 pointer-events-none"
      >
        <PawIcon className="w-16 h-16 sm:w-20 sm:h-20" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Testimonial Cards Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSet}
            initial={{ opacity: 0, x: activeSet === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeSet === 0 ? 20 : -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {TESTIMONIAL_SETS[activeSet].map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-100 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-1"
              >
                {/* Customer Avatar Circle */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border-2 border-emerald-100 shadow-xs">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 space-y-1 min-w-0">
                  <h4 className="text-sm font-bold text-stone-900 leading-tight truncate">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {t.city}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 py-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-stone-700 italic leading-snug line-clamp-3">
                    {t.quote}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicator dots matching screenshot */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveSet(0)}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              activeSet === 0 ? 'bg-[#277438] scale-125' : 'bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label="Slide 1"
          />
          <button
            onClick={() => setActiveSet(1)}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              activeSet === 1 ? 'bg-[#277438] scale-125' : 'bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label="Slide 2"
          />
        </div>
      </div>
    </section>
  );
}
