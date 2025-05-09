// app/testcomponents/TestRegister.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import TestNavbar from './TestNavbar';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function TestRegister() {
  // State for tabs, form fields, auth
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // On mount: check if user is already logged in
  useEffect(() => {
    const stored = localStorage.getItem('userEmail');
    if (stored) {
      setUserEmail(stored);
      setLoggedIn(true);
    }
    // If URL has #register, switch tab
    if (window.location.hash === '#register') {
      setActiveTab('register');
    }
  }, []);

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      if (activeTab === 'register') {
        // Registration
        const res = await fetch('/api/testRegister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Registration failed');
        } else {
          alert('Registered! Please sign in.');
          setActiveTab('login');
          setEmail('');
          setPassword('');
        }
      } else {
        // Login
        const res = await fetch('/api/testLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Login failed');
        } else {
          // Mark as logged in
          localStorage.setItem('userEmail', data.email);
          setUserEmail(data.email);
          setLoggedIn(true);
          alert(`Welcome back, ${data.email.split('@')[0]}!`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network or server error');
    }
  };

  // If user is logged in, show dashboard instead of form
  if (loggedIn && userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">My Account</h1>
          </div>
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-1/4 border-r">
              <div className="p-6 text-center">
                <div className="inline-block p-4 bg-gray-100 rounded-full">
                  <span className="text-2xl text-gray-500">{userEmail[0].toUpperCase()}</span>
                </div>
                <p className="mt-4 font-semibold">{userEmail.split('@')[0]}</p>
              </div>
              <nav className="space-y-2 px-4 pb-6">
                {['Dashboard','Orders','Downloads','Addresses','Account details'].map((label, i) => (
                  <a
                    key={i}
                    href={`#${label.toLowerCase().replace(/\s+/g,'')}`}
                    className="block py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">
              <section id="dashboard">
                <h2 className="text-xl font-semibold mb-2">Account overview</h2>
                <p>From your account dashboard you can view your <a href="#orders" className="text-green-600 underline">Recent orders</a>.</p>
                <p>Manage your <a href="#addresses" className="text-green-600 underline">Shipping and Billing addresses</a>.</p>
                <p>Edit your <a href="#accountdetails" className="text-green-600 underline">Password and Account details</a>.</p>
              </section>
              <section id="orders">
                <h3 className="font-medium">Orders</h3>
                <p className="text-gray-600">No orders yet.</p>
              </section>
              <section id="downloads">
                <h3 className="font-medium">Downloads</h3>
                <p className="text-gray-600">No downloads available.</p>
              </section>
              <section id="addresses">
                <h3 className="font-medium">Addresses</h3>
                <p className="text-gray-600">No addresses on file.</p>
              </section>
              <section id="accountdetails">
                <h3 className="font-medium">Account details</h3>
                <p className="text-gray-600">Update your details here.</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render the Sign In / Register form
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header Tabs */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2 font-semibold cursor-pointer ${
              activeTab === 'login' ? 'text-black border-b-2 border-black' : 'text-gray-500'
            }`}
            style={{ background: 'transparent' }}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2 font-semibold cursor-pointer ${
              activeTab === 'register' ? 'text-black border-b-2 border-black' : 'text-gray-500'
            }`}
            style={{ background: 'transparent' }}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        {/* Password input */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-10 -translate-y-1/2 text-gray-500"
            style={{ background: 'transparent' }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Sign In only options */}
        {activeTab === 'login' && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 border-gray-300 rounded focus:ring-0" />
              <span className="text-gray-700">Keep me signed in</span>
            </label>
            <Link href="#" className="text-gray-500" style={{ background: 'transparent' }}>
              Forgot password?
            </Link>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white bg-gray-800 font-semibold"
          style={{ background: '#333', border: 'none' }}
        >
          {activeTab === 'register' ? 'Register' : 'Sign In'}
        </button>
      </form>

      {/* Footer toggle */}
      <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-400">
        {activeTab === 'login' ? (
          <>New Customer?{' '}
            <button onClick={() => setActiveTab('register')} className="text-black underline" style={{ background: 'transparent', padding: 0 }}>
              Create account
            </button>
          </>
        ) : (
          <>Already a member?{' '}
            <button onClick={() => setActiveTab('login')} className="text-black underline" style={{ background: 'transparent', padding: 0 }}>
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
