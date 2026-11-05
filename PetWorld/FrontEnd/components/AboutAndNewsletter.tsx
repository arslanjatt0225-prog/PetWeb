'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Mail, CheckCircle, Heart } from 'lucide-react';
import { PawIcon } from './PawIcon';

export function AboutAndNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribing(true);
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setMessage('Thank you for subscribing! Check your inbox soon.');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Card: About PetWorld */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-[#fbf9f4] border border-stone-200/80 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-6 shadow-sm overflow-hidden relative hover:shadow-md transition-shadow"
          >
            {/* Sleeping Cat Image with Floating Doodle Hearts */}
            <div className="relative w-full sm:w-1/2 h-52 sm:h-56 rounded-2xl overflow-hidden shrink-0 shadow-md">
              <Image
                src="/images/about_sleeping_cat.jpg"
                alt="Adorable sleeping tabby kitten curled up cozy on a fluffy blanket"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 300px"
              />

              {/* Doodle Green Floating Hearts matching screenshot */}
              <motion.div
                animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-3 left-4 text-emerald-600 drop-shadow-md"
              >
                <Heart className="w-5 h-5 fill-none stroke-[2.5]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-1 right-6 text-emerald-600 drop-shadow-md"
              >
                <Heart className="w-6 h-6 fill-none stroke-[2.5]" />
              </motion.div>
            </div>

            {/* About Copy */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <span className="text-xs font-black tracking-wider text-[#277438] uppercase">
                About PetWorld
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                A Better Life <br />
                for Your Pets
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                We provide high-quality pet supplies with love and care, because they are family.
              </p>

              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#1b4e28] hover:bg-[#12381c] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Card: Newsletter Subscription with Peeking Golden Retriever Puppy */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-[#103b22] text-white rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            {/* Paw Print Background Watermarks */}
            <motion.div
              animate={{ rotate: [12, 18, 12] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-1/3 text-emerald-700/30 pointer-events-none"
            >
              <PawIcon className="w-16 h-16" />
            </motion.div>

            {/* Peeking Dog on the Right matching screenshot */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-1 -right-3 w-40 sm:w-48 h-44 sm:h-52 pointer-events-none z-10 hidden sm:block"
            >
              <Image
                src="/images/newsletter_peeking_puppy.jpg"
                alt="Cute smiling golden retriever puppy peeking over counter"
                fill
                className="object-contain object-bottom"
                sizes="200px"
              />
            </motion.div>

            <div className="relative z-20 space-y-3 sm:space-y-4 max-w-sm sm:max-w-md">
              {/* Mail Icon & Paw Accent */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#237536] text-white shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <PawIcon className="w-6 h-6 text-[#34a54f]" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
                  Get the latest deals and pet care tips.
                </p>
              </div>

              {/* Form Input matching screenshot */}
              <form onSubmit={handleSubscribe} className="pt-2">
                <div className="relative flex items-center bg-white rounded-full p-1 shadow-md max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-transparent border-none px-4 py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="inline-flex items-center gap-1.5 bg-[#f58220] hover:bg-[#e06f10] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shrink-0 shadow-sm active:scale-95"
                  >
                    <span>{subscribing ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {message && (
                  <p className="text-xs text-emerald-200 mt-2 flex items-center gap-1.5">
                    {subscribed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    {message}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
