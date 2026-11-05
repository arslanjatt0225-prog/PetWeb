'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { CheckCircle2, XCircle, Clock, Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuth } from '@/PetWorld/FrontEnd/context/AuthContext';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { openAuthModal } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'expired' | 'error' | 'idle'>(
    token ? 'verifying' : 'idle'
  );
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) {
      setStatus('idle');
      return;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Your email address has been successfully verified!');
        } else if (data.expired) {
          setStatus('expired');
          setMessage(data.error || 'Your verification link has expired.');
          if (data.email) setResendEmail(data.email);
        } else {
          setStatus('error');
          setMessage(data.error || 'Invalid or already-used verification link.');
        }
      } catch {
        if (!isMounted) return;
        setStatus('error');
        setMessage('Network error while verifying email. Please try again.');
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || cooldown > 0) return;

    setResending(true);
    setResendError('');
    setResendMessage('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setResending(false);

      if (data.success) {
        setResendMessage(data.message || 'Verification email dispatched successfully!');
        setCooldown(60);
      } else {
        setResendError(data.error || 'Failed to resend verification email.');
      }
    } catch {
      setResending(false);
      setResendError('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 w-full">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl space-y-6 text-center">
        {status === 'verifying' && (
          <div className="space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#277438] flex items-center justify-center mx-auto border-4 border-emerald-100 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Verifying Your Account...
            </h1>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Please wait a moment while we validate your secure verification token with PetWorld.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                Verified Customer
              </span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Email Verified Successfully!
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                {message} You now have full access to your PetWorld account, order tracking, and exclusive discounts.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  openAuthModal('login');
                  router.push('/');
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#277438] text-white text-xs font-bold py-3.5 px-6 rounded-full shadow-md hover:bg-[#1e5c2b] transition-all"
              >
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-700 text-xs font-bold py-3.5 px-6 rounded-full hover:bg-stone-200 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {(status === 'expired' || status === 'error' || status === 'idle') && (
          <div className="space-y-5">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-4 shadow-sm ${
                status === 'expired'
                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                  : 'bg-red-100 text-red-600 border-red-200'
              }`}
            >
              {status === 'expired' ? <Clock className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                {status === 'expired'
                  ? 'Verification Link Expired'
                  : status === 'error'
                  ? 'Verification Failed'
                  : 'Verify Your Email'}
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                {message ||
                  'Please enter your email below to receive a fresh verification link to activate your PetWorld account.'}
              </p>
            </div>

            {/* Resend Form */}
            <form onSubmit={handleResend} className="space-y-4 pt-2 text-left">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Your Account Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#277438]/20 focus:border-[#277438] transition-all"
                  />
                </div>
              </div>

              {resendError && (
                <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-200">
                  {resendError}
                </p>
              )}

              {resendMessage && (
                <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {resendMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={resending || cooldown > 0}
                className="w-full flex items-center justify-center gap-2 bg-[#277438] hover:bg-[#1e5c2b] text-white font-bold text-xs py-3.5 rounded-full shadow-lg shadow-[#277438]/20 transition-all disabled:opacity-70"
              >
                {resending ? (
                  <span>Sending New Link...</span>
                ) : cooldown > 0 ? (
                  <span>Resend available in {cooldown}s</span>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs text-stone-500 hover:text-[#277438]">
                Return to PetWorld Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading verification...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
