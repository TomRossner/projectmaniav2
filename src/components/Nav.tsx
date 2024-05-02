'use client'

import React from 'react';
import { closeMobileMenu, openMobileMenu, openNewProjectModal } from '@/store/app/app.slice';
import { MdMenu } from 'react-icons/md';
import { useAppDispatch } from '@/hooks/hooks';
import Logo from './utils/Logo';
import { BiPlus } from 'react-icons/bi';
import ToolTip from './common/ToolTip';
import useAuth from '@/hooks/useAuth';
import { LINKS } from '@/utils/links';
import Link from 'next/link';

const Nav = () => {
    const dispatch = useAppDispatch();
    const {isAuthenticated} = useAuth();
    
    const openMenu = () => dispatch(openMobileMenu());
    const closeMenu = () => dispatch(closeMobileMenu());

    const handleNewProjectClick = (): void => {
      dispatch(openNewProjectModal());

      closeMenu();
    }

  return (
    <nav className='sticky top-1 left-0 flex items-center py-1 px-2 z-40 mb-3'>
      <button
        onClick={openMenu}
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
        action={closeMenu}
        additionalStyles='absolute top-2 left-0 right-0 mx-auto'
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
          Sign in
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

                <span className='text-center hidden sm:inline-block pt-1 text-xl font-medium'>
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