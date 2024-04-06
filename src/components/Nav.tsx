'use client'

import React from 'react';
import { closeMobileMenu, openMobileMenu, openNewProjectModal } from '@/store/app/app.slice';
import { MdMenu } from 'react-icons/md';
import { useAppDispatch } from '@/hooks/hooks';
import Logo from './utils/Logo';
import Button from './common/Button';
import { BiPlus } from 'react-icons/bi';
import { Tooltip } from '@greguintow/react-tippy';

const Nav = () => {
    const dispatch = useAppDispatch();
    
    const openMenu = () => dispatch(openMobileMenu());
    const closeMenu = () => dispatch(closeMobileMenu());

    const handleNewProjectClick = (): void => {
      dispatch(openNewProjectModal());

      closeMenu();
    }

  return (
    <nav className='sticky top-1 left-0 flex items-center py-1 px-2 z-40'>
      <span
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
      </span>
      
      <Logo
        action={closeMenu}
        additionalStyles='absolute top-2 left-0 right-0 mx-auto'
      />

      <Tooltip
        arrow
        duration={150}
        position='top'
        inertia
        animation='scale'
        title='New project'
        className='absolute right-2'
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
      </Tooltip>
    </nav>
  )
}

export default Nav;