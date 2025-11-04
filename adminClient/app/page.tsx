'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import logo from '/public/logo.png'; // Make sure logo.png is inside your "public" folder

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-96 border border-white/30 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="App Logo"
            width={80}
            height={80}
            className="rounded-lg shadow-md"
          />
        </div>

        <h2 className="text-3xl font-semibold mb-6 text-white drop-shadow-md">
          Admin Login
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
        >
          <input
            className="border border-white/30 bg-white/20 text-white placeholder-white/70 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border border-white/30 bg-white/20 text-white placeholder-white/70 p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold w-full py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300">
            Login
          </button>
        </form>

        <p className="text-center text-white/80 text-sm mt-4">
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
}
