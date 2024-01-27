'use client'

import React from 'react';
import { APP_VERSION_FULL } from '@/utils/constants';

const Footer = () => {
    const YEAR: number = new Date().getFullYear();

  return (
    <footer className={`
      flex
      justify-between
      items-center
      fixed
      bg-slate-100
      w-screen
      bottom-0
      px-2
      py-1
      sm:justify-center
      sm:gap-3
    `}>
        <p className='font-semibold text-blue-500 pt-1'>ProjectMania v{APP_VERSION_FULL}</p>
        <span className='hidden pt-1 sm:block'>|</span>
        <p className='pt-1'>&copy; Tom Rossner {YEAR}</p>
    </footer>
  )
}

export default Footer;