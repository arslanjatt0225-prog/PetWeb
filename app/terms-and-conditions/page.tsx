import React from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Terms & Conditions</h1>
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Welcome to PetWorld. By accessing our website, placing an order, or utilizing our services, you agree to comply with and be bound by the following terms.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">1. Purchases and Pricing</h3>
          <p>
            All listed prices are displayed in USD (or local equivalent) and are subject to availability. We reserve the right to revise catalog pricing and promotional coupon terms at any time.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">2. Cash on Delivery (COD)</h3>
          <p>
            Customers choosing Cash on Delivery agree to provide an accurate address and phone contact for courier validation. Refusal of delivery without cause may restrict future COD privileges.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
