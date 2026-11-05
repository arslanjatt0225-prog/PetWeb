'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/image';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { PawIcon } from '@/PetWorld/FrontEnd/components/PawIcon';
import { Heart, ShieldCheck, Truck, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#277438] text-xs font-bold px-3 py-1 rounded-full">
            <PawIcon className="w-3.5 h-3.5" />
            <span>Our Journey & Passion</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 leading-tight">
            Caring for Your Pets <br />
            <span className="text-[#277438]">Like Family.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            At PetWorld, we believe every wag, purr, chirp, and splash brings immeasurable joy to our lives. That’s why we source only veterinarian-approved, all-natural, and durable pet essentials.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80"
              alt="Veterinarian with golden retriever"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              A Better Standard of Pet Care
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Founded in 2020 by passionate animal caretakers and certified nutritionists, PetWorld was born out of frustration with low-grade pet foods filled with cheap corn fillers and easily breakable toys.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Every single product in our catalog—from grain-free salmon kibbles to orthopedic donut calming beds—is thoroughly vetted for animal safety, nutritional integrity, and longevity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <span className="text-2xl font-black text-[#277438] block">25,000+</span>
                <span className="text-xs text-stone-500">Happy Pets Served</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <span className="text-2xl font-black text-[#277438] block">100%</span>
                <span className="text-xs text-stone-500">Pet Happiness Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#277438] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Compassion First</h3>
            <p className="text-xs text-stone-500">
              We donate a portion of all proceeds every month to local animal rescue shelters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#277438] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Vet Approved</h3>
            <p className="text-xs text-stone-500">
              All formulas meet rigorous health and safety standards for growing and senior animals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#277438] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Swift Delivery</h3>
            <p className="text-xs text-stone-500">
              Free shipping on orders over $50 with reliable nationwide express dispatch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#277438] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Top Quality</h3>
            <p className="text-xs text-stone-500">
              Non-toxic, chew-tested materials crafted to withstand years of active play.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
