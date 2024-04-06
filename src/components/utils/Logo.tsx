'use client'

import React from 'react';
import Link from 'next/link';
import { APP_VERSION } from '@/utils/constants';
import { LINKS } from '@/utils/links';

interface ILogoProps {
    action: () => void;
    additionalStyles?: string;
}

const Logo = ({action, additionalStyles}: ILogoProps) => {

  return (
    <Link
      href={LINKS.HOME}
      id='logo'
      onClick={action}
      className={`
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
      `}
    >
      <span>PM</span>
      <span className='font-normal text-2xl'>v{APP_VERSION}</span>
    </Link>
  )
}

export default Logo;