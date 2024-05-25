'use client'

import React from 'react';
import { APP_VERSION_FULL } from '@/utils/constants';
import Link from 'next/link';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { LINKS } from '@/utils/links';
import { SocialLinks } from '@/utils/types';

const Footer = () => {
    const YEAR: number = new Date().getFullYear();

  return (
    <footer
      className={`
        flex
        items-center
        fixed
        bg-slate-100
        w-screen
        bottom-0
        px-3
        py-1
        sm:justify-center
        sm:gap-3
        gap-3
      `}
    >
        <Link
          href={LINKS.HOME}
          className='font-semibold text-blue-500 pt-1 grow'
        >
          Projem v{APP_VERSION_FULL}
        </Link>
        {/* <span className='pt-1 text-slate-300 grow'>|</span> */}

        <Link
          href={SocialLinks.Portfolio}
          target='_blank'
          rel='noreferrer noopener'
          className='pt-1'
        >
          Tom Rossner&copy; {YEAR}
        </Link>

        <span className='pt-1 text-slate-300'>|</span>
        
        <div className='flex items-center gap-3'>
          <Link
            target='_blank'
            rel='noreferrer noopener'
            href={SocialLinks.Github}
            className='flex items-center gap-1'
          >
            <BsGithub />
            <span className='hidden sm:flex pt-1'>GitHub</span>
          </Link>

          <Link
            target='_blank'
            rel='noreferrer noopener'
            href={SocialLinks.LinkedIn}
            className='flex items-center gap-1'
          >
            <BsLinkedin className='text-blue-600'/>
            <span className='hidden sm:flex pt-1'>LinkedIn</span>
          </Link>
        </div>

    </footer>
  )
}

export default Footer;