'use client'

import React from 'react';
import MenuListItem from './MenuListItem';
import useAuth from '@/hooks/useAuth';
import { twMerge } from 'tailwind-merge';
import { MenuItem } from '@/utils/types';

type MenuListProps = {
    list: MenuItem[];
    listIdx: number;
}

const MenuList = ({list, listIdx}: MenuListProps) => {
  const {isAuthenticated} = useAuth();

  return (
    <ul
      className={twMerge(`
        flex
        flex-col
        text-xl
        gap-1
        mt-20
        w-full
        select-none
        py-3
        ${listIdx === 1 && 'grow justify-end'}
      `)}
    >
      {list.map((opt: MenuItem, optIdx: number) => {
        if (!isAuthenticated && opt.text === 'Profile') return;
        if (isAuthenticated && opt.text === 'Sign in') return;
        if (!isAuthenticated && opt.text === 'Sign out') return;

        else return <MenuListItem key={optIdx} listItem={opt} />
      })}
    </ul>
  )
}

export default MenuList;