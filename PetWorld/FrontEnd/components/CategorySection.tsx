'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'dog',
    name: 'Dog\nSupplies',
    slug: 'dog-supplies',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80', // Golden retriever smiling
  },
  {
    id: 'cat',
    name: 'Cat\nSupplies',
    slug: 'cat-supplies',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80', // Tabby cat
  },
  {
    id: 'bird',
    name: 'Bird\nSupplies',
    slug: 'bird-supplies',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80', // Colorful parrot
  },
  {
    id: 'fish',
    name: 'Fish\nSupplies',
    slug: 'fish-supplies',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=500&q=80', // Swimming goldfish
  },
  {
    id: 'small-pet',
    name: 'Small Pet\nSupplies',
    slug: 'small-pet-supplies',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=500&q=80', // Cute bunny
  },
  {
    id: 'food',
    name: 'Pet Food',
    slug: 'pet-food',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=500&q=80', // Bowl of pet kibble
  },
  {
    id: 'toys',
    name: 'Pet Toys',
    slug: 'pet-toys',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=500&q=80', // Colorful rope chew toy
  },
];

export function CategorySection() {
  return (
    <section className="w-full py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-[#277438]" />
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#277438] uppercase">
              Shop by Category
            </span>
            <span className="w-8 h-[2px] bg-[#277438]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Find the Perfect Products
          </h2>
        </div>

        {/* 7 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center bg-[#f7f6f2] hover:bg-[#ebf5ed] border border-stone-200/60 rounded-2xl p-2.5 sm:p-3 transition-all duration-300 hover:shadow-lg text-center"
              >
                {/* Image Container with rounded top */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-3 shadow-inner">
                  <Image
                    src={cat.image}
                    alt={cat.name.replace('\n', ' ')}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Category Title */}
                <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-[#277438] transition-colors whitespace-pre-line leading-tight">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
