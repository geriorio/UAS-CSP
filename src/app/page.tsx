'use client';

import './globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home(){
  const router = useRouter();

  useEffect(() => {
    router.replace('/signin');
  }, []);

  return null;
}
