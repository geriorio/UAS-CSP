'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { setSession } from '@/utils/auth';
import { User } from '@/types'; // Harus ada id, username, email, role

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan Password wajib diisi.');
      return;
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.session) {
      console.error('Login error:', loginError?.message);
      setError('Email atau password salah.');
      return;
    }

    const userId = data.user.id;

    // Ambil username dan role dari tabel 'members'
    const { data: profile, error: profileError } = await supabase
      .from('members')
      .select('id, username, role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError?.message);
      setError('Gagal mengambil data pengguna.');
      return;
    }

    const user: User = {
      id: profile.id,
      username: profile.username,
      role: profile.role,
    };

    setSession(user);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>

      <input
        placeholder="Email"
        className="border p-2 w-64 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-64 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-64 hover:bg-blue-700"
        onClick={handleLogin}
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
