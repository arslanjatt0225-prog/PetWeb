import React from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Return & Exchange Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Backed by our <strong>100% Pet Happiness Guarantee</strong>, your satisfaction is our foremost priority.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">30-Day Happiness Guarantee</h3>
          <p>
            If a bed, harness, toy, or grooming brush does not meet your expectations or fit your pet comfortably, contact us within 30 days of receiving your package for an exchange or refund.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">Pet Food & Consumables</h3>
          <p>
            If your pet is a picky eater or dislikes a newly purchased kibble flavor, we will exchange it for an alternative formula or issue a store credit.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
