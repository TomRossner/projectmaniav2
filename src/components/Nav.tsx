'use client'

import React from 'react';
import { closeMobileMenu, openMobileMenu } from '@/store/app/app.slice';
import { MdMenu } from 'react-icons/md';
import { useAppDispatch } from '@/hooks/hooks';
import Logo from './Logo';

const Nav = () => {
    const dispatch = useAppDispatch();
    
    const openMenu = () => dispatch(openMobileMenu());
    const closeMenu = () => dispatch(closeMobileMenu());

  return (
    <nav className='sticky top-0 left-0 flex items-align py-1 px-2 z-40'>
      <MdMenu onClick={openMenu} className='text-blue-500 text-4xl cursor-pointer hover:text-blue-600'/>
      <Logo action={closeMenu} additionalStyles='fixed top-2 left-0 right-0 mx-auto'/>
    </nav>
  )
}

export default Nav;