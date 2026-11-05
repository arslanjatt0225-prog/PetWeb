'use client';

import React, { useState } from 'react';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { Phone, Mail, MapPin, CheckCircle, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Question');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to send message');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#277438] uppercase">
            We’re Here for You & Your Pet
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Get in Touch with PetWorld
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Questions regarding an order, product sizing, or pet dietary advice? Our dedicated support team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-[#103b22] text-white rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-xl font-black">Support Headquarters</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Reach out directly by phone, email, or visit our flagship retail and care center.
            </p>

            <div className="space-y-4 pt-4 border-t border-emerald-800/80 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#237536] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[10px] uppercase font-bold">Call Us</p>
                  <p className="font-semibold text-white">+92 300 123 4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#237536] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[10px] uppercase font-bold">Email Us</p>
                  <p className="font-semibold text-white">info@petworld.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#237536] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[10px] uppercase font-bold">Location</p>
                  <p className="font-semibold text-white">123 Pet Street, Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#237536] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[10px] uppercase font-bold">Service Hours</p>
                  <p className="font-semibold text-white">24/7 Dedicated Online Assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#277438] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Message Received!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you, {name}. A member of our Pet Care team will respond to {email} within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="bg-[#113d22] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1a532d]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Send an Inquiry</h3>

                {errorMsg && (
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  >
                    <option value="Product Question">Product & Sizing Question</option>
                    <option value="Order Tracking">Order Tracking & Shipping</option>
                    <option value="Return / Exchange">Return or Exchange Request</option>
                    <option value="Partnership / Wholesale">Brand Partnership / Wholesale</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you and your furry friend today?"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#277438]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-xs px-8 py-3 rounded-full shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
