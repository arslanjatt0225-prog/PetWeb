import React from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Privacy Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            At <strong>PetWorld</strong>, we value the trust you place in us when sharing your personal details and pet profiles. This Privacy Policy outlines our procedures regarding the collection, safeguarding, and use of customer data.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">1. Information We Collect</h3>
          <p>
            When registering, placing an order, or joining our newsletter, we collect names, delivery street addresses, phone contact numbers, and email details necessary to fulfill shipments and communicate order updates.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">2. Security and Encryption</h3>
          <p>
            Passwords are cryptographically hashed using salted bcrypt algorithms. Sensitive payment transmissions are safeguarded via SSL 256-bit encryption. We never sell or lease customer contact lists to third-party advertisers.
          </p>
          <h3 className="text-base font-bold text-stone-900 pt-2">3. Cookies & Session Storage</h3>
          <p>
            We use secure, HTTP-only cookies and browser storage strictly to maintain cart persistence and keep customers authenticated during browsing sessions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
