'use client';

import React, { useState } from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Free Shipping work?',
    a: 'We offer 100% Free Shipping on all orders of $50 or more! For orders under $50, a standard flat-rate delivery charge of $4.99 applies nationwide.',
  },
  {
    q: 'What is the Pet Happiness Guarantee?',
    a: 'If your pet doesn’t completely fall in love with their new bed, toy, or food within 30 days, simply contact our team. We offer hassle-free replacements or a full refund with no hard feelings.',
  },
  {
    q: 'What payment options do you support?',
    a: 'We gladly support Cash on Delivery (COD) throughout Pakistan, as well as Visa, MasterCard, and debit cards with 256-bit bank-level encryption.',
  },
  {
    q: 'Are your pet foods veterinarian-approved?',
    a: 'Yes! Every single bag of kibble, wet food pouch, and organic treat on PetWorld is vetted by certified veterinary nutritionists, free from artificial dyes, toxic fillers, or low-grade meat byproducts.',
  },
  {
    q: 'How can I track my shipment?',
    a: 'Once your order is processed, you will receive an SMS and email notification with your tracking number. You can also view live delivery milestones inside your PetWorld account under "My Orders".',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#277438] uppercase">
            Frequently Asked Questions
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Got Questions? We’ve Got Answers.
          </h1>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-stone-900 hover:text-[#277438] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openIdx === idx ? 'rotate-180 text-[#277438]' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
