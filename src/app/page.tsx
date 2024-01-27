'use client'

import useAuth from '@/hooks/useAuth';
import { APP_VERSION } from '@/utils/constants';

export default function Home() {
  const {user} = useAuth();

  return (
    <main className='text-xl py-5 px-4'>
      <h1 className='text-2xl text-center font-semibold'>
        {user ? `Welcome back ${user?.firstName}` : `Welcome to ProjectMania v${APP_VERSION} !`}
      </h1>
    </main>
  )
}