'use client'

import React from 'react';
import { MdMenu } from 'react-icons/md';
import Logo from './utils/Logo';
import { BiPlus } from 'react-icons/bi';
import ToolTip from './common/ToolTip';
import useAuth from '@/hooks/useAuth';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import useMobileMenu from '@/hooks/useMobileMenu';
import useModals from '@/hooks/useModals';
import { CgProfile } from 'react-icons/cg';
import Icon from './common/Icon';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { SCREEN_SIZES } from '@/utils/constants';

const Nav = () => {
    const {isAuthenticated} = useAuth();
    const {openMobileMenu, closeMobileMenu} = useMobileMenu();
    const {openNewProjectModal} = useModals();
    const {width} = useWindowDimensions();

    const handleNewProjectClick = () => {
      openNewProjectModal();
      closeMobileMenu();
    }

  return (
    <nav className='sticky top-1 left-0 flex items-center py-1 px-2 z-30 mb-3'>
      <button
        onClick={openMobileMenu}
        className={`
          flex
          items-center
          justify-center
          rounded-bl-lg
          cursor-pointer
          text-slate-500
          text-2xl
          bg-slate-100
          sm:hover:text-slate-800
          sm:hover:bg-slate-200
          active:text-slate-800
          active:bg-slate-200
          w-10
          h-10
          transition-colors
          duration-75
        `}
      >
        <MdMenu />
      </button>
      
      <Logo
        action={closeMobileMenu}
        additionalStyles='absolute top-1 left-0 right-0 mx-auto'
      />

      {!isAuthenticated ? (
        <Link
          href={LINKS.SIGN_IN}
          className={`
            absolute
            right-2
            max-w-1/4
            py-2
            px-3
            sm:px-4
            sm:pl-3
            flex
            gap-2
            self-center
            items-center
            rounded-bl-lg
            transition-colors
            duration-100
            text-lg
            font-medium
            bg-slate-100
            text-blue-400
            active:bg-slate-200
            sm:hover:bg-slate-200
            active:text-blue-500
            sm:hover:text-stone-800
          `}
        >
          {(!!width && (width <= SCREEN_SIZES["md"]))
            ? <Icon
                icon={<CgProfile />}
                additionalStyles='text-2xl text-stone-500 sm:hover:text-stone-700 active:text-stone-700'
              />
            : 'Sign in'
          }
        </Link>
      ) : (
        <div className='absolute right-2'>
          <ToolTip
            arrow
            inertia
            position='bottom'
            title='New project'
          >
            <button
              onClick={handleNewProjectClick}
              type='button'
              className={`
                max-w-1/4
                py-2
                px-3
                sm:px-4
                sm:pl-3
                flex
                gap-2
                self-center
                items-center
                rounded-bl-lg
                transition-colors
                duration-100
                bg-slate-100
                text-slate-500
                active:bg-slate-200
                sm:hover:bg-slate-200
                active:text-stone-800
                sm:hover:text-stone-800
              `}
              >
                <span className='text-2xl'>
                  <BiPlus />
                </span>

                <span className='text-center hidden sm:inline-block text-xl font-medium'>
                  New project
                </span>
            </button>
          </ToolTip>
        </div>
      )}
    </nav>
  )
}

export default Nav;