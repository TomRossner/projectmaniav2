'use client'

import Container from '@/components/common/Container';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <Container id='notFoundPage'>
      <div className='w-full flex flex-col'>
        <p className='text-[30px] text-red-400 font-semibold text-center'>Ermmm...</p>

        <div className='w-full flex flex-col items-center justify-between py-7'>
          <p className='text-[80px] font-semibold text-red-600'>404</p>
          <span className='text-[40px] text-red-400'>Page Not Found</span>
        </div>

        <p className='text-red-400 font-light text-lg text-center my-5'>The page you&apos;re looking for does&apos;nt exist.</p>

        <Link href={LINKS.HOME} className='self-center w-auto text-lg border px-4 py-2 border-black cursor-pointer'>Back to the homepage</Link>
      </div>
    </Container>
  )
}

export default NotFound;