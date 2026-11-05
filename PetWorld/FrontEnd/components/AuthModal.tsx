'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewVerifyLink, setPreviewVerifyLink] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setErrorMsg('');
    setSuccessMsg('');
    setPreviewVerifyLink('');
  };

  const handleTabChange = (tab: 'login' | 'register' | 'forgot') => {
    resetForm();
    setAuthModalTab(tab);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setPreviewVerifyLink('');
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account');
    } else {
      setSuccessMsg(
        res.message || 'Account created! Please check your email inbox to verify your account.'
      );
      if (res.previewVerifyLink) {
        setPreviewVerifyLink(res.previewVerifyLink);
      }
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
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
        setSuccessMsg(data.message);
        if (data.previewLink) {
          setSuccessMsg(
            `Password reset token generated! In preview mode, you can use this link to reset: ${data.previewLink}`
          );
        }
      } else {
        setErrorMsg(data.error || 'Request failed');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-stone-100 bg-[#fbf9f4]">
          <div>
            <h3 className="text-xl font-black text-stone-900">
              {authModalTab === 'login' && 'Welcome Back'}
              {authModalTab === 'register' && 'Create Your Account'}
              {authModalTab === 'forgot' && 'Reset Password'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {authModalTab === 'login' && 'Sign in to access your orders and favorites'}
              {authModalTab === 'register' && 'Join the PetWorld family for exclusive perks'}
              {authModalTab === 'forgot' && "Enter your email and we'll dispatch a secure reset link"}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Accounts Banner for Quick Verification */}
        {authModalTab === 'login' && (
          <div className="bg-emerald-50/80 px-6 py-2.5 border-b border-emerald-100/60 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-semibold text-[11px]">Quick Demo Logins:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@petworld.com');
                  setPassword('AdminPassword123!');
                }}
                className="bg-[#113d22] text-white text-[10px] font-bold px-2 py-0.5 rounded hover:bg-[#1a532d]"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('ayesha@example.com');
                  setPassword('Customer123!');
                }}
                className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded hover:bg-emerald-800"
              >
                Customer
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="break-all">{successMsg}</span>
            </div>
          )}

          {previewVerifyLink && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-bold">💡 Dev Mode Verification Link:</p>
              <a
                href={previewVerifyLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#277438] underline font-mono text-[11px] break-all block"
              >
                {previewVerifyLink}
              </a>
            </div>
          )}


          {/* 1. LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-[11px] font-semibold text-[#277438] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-all mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center pt-2 text-xs text-stone-500">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="font-bold text-[#277438] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-all mt-2"
              >
                {loading ? 'Registering...' : 'Register Account'}
              </button>

              <div className="text-center pt-2 text-xs text-stone-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="font-bold text-[#277438] hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#277438]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#113d22] hover:bg-[#1a532d] text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition-all"
              >
                {loading ? 'Sending...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2 text-xs text-stone-500">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="font-bold text-[#277438] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
