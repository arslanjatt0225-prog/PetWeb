import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { INITIAL_BLOGS } from '@/PetWorld/Backend/seedData';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#277438] uppercase">
            Pet Care Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Wellness & Training Guides
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Expert advice, veterinarian dietary tips, and enriching care routines for happier companions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {INITIAL_BLOGS.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-[#277438] transition-all flex flex-col"
            >
              <div className="relative w-full h-52 overflow-hidden bg-stone-100">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#113d22] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug line-clamp-2 hover:text-[#277438]">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-500">
                    By {blog.author}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#277438] hover:underline">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
