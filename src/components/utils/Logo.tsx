'use client'

import React from 'react';
import Link from 'next/link';
import { LINKS } from '@/utils/links';
import { twMerge } from 'tailwind-merge';

type LogoProps = {
    action: () => void;
    additionalStyles?: string;
}

const Logo = ({action, additionalStyles}: LogoProps) => {

  return (
    <Link
      href={LINKS.HOME}
      id='logo'
      onClick={action}
      className={twMerge(`
        flex
        items-center
        gap-2
        text-4xl
        text-blue-500
        font-bold
        w-fit
        px-3
        justify-center
        cursor-pointer
        select-none
        ${additionalStyles}
      `)}
    >
      <span>Project Mania</span>
      {/* <span className='font-normal text-2xl'>v{APP_VERSION}</span> */}
    </Link>
  )
}

export default Logo;