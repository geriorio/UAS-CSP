'use client';

import { clearSession } from '@/utils/auth';

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const logout = () => {
    clearSession();
    window.location.href = '/signin';
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-4 rounded">
      <div className="text-lg font-bold">Dashboard</div>
      <div>
        {username} |{' '}
        <button onClick={logout} className="underline ml-2">
          Logout
        </button>
      </div>
    </div>
  );
}
