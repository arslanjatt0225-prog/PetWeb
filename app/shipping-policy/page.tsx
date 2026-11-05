import React from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Shipping Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            At PetWorld, our priority is getting healthy food, cozy beds, and stimulating toys to your pets promptly and safely.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">Free Shipping on Orders Over $50</h3>
          <p>
            Every order with a merchandise subtotal of $50.00 or higher qualifies automatically for <strong>Free Standard Nationwide Shipping</strong>. For orders under $50, flat-rate shipping is $4.99.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">Delivery Times</h3>
          <p>
            Standard deliveries arrive within 2 to 4 business days. Major metropolitan areas (Lahore, Karachi, Islamabad) often receive next-day or 48-hour delivery.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
