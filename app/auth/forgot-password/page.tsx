'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewLink, setPreviewLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSubmitted(true);
        if (data.previewLink) {
          setPreviewLink(data.previewLink);
        }
      } else {
        setErrorMsg(data.error || 'Failed to request password reset. Please try again.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#277438]/10 text-[#277438] flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Forgot Password?</h1>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Enter your registered PetWorld email address and we will dispatch a secure password reset link via Gmail.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-stone-900">Check Your Email</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  If an account exists for <strong className="text-stone-900">{email}</strong>, a password reset link has been dispatched. Please check your inbox and spam folder.
                </p>
              </div>

              {previewLink && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <span>💡 Dev Preview Link:</span>
                  </p>
                  <a
                    href={previewLink}
                    className="text-[#277438] underline break-all font-mono hover:text-[#1b5027]"
                  >
                    {previewLink}
                  </a>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#277438] text-white text-xs font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#1e5c2b] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#277438]/20 focus:border-[#277438] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#277438] hover:bg-[#1e5c2b] text-white font-bold text-xs py-3.5 rounded-full shadow-lg shadow-[#277438]/20 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <span>Dispatching Email...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Password Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#277438] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to PetWorld
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
