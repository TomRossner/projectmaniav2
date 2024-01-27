'use client'

import React from 'react';
import { IMenuItem } from './MobileMenu';
import MenuListItem from './MenuListItem';
import useAuth from '@/hooks/useAuth';

interface IMenuListProps {
    list: IMenuItem[];
    listIdx: number;
}

const MenuList = ({list, listIdx}: IMenuListProps) => {
  const {isAuthenticated} = useAuth();

  return (
    <ul className={`flex flex-col text-xl gap-1 mt-20 w-full select-none p-3 ${listIdx === 1 ? 'grow justify-end' : ''}`}>
        {list.map((opt: IMenuItem, optIdx: number) => {
          if (!isAuthenticated && opt.text === 'Profile') return;
          if (isAuthenticated && opt.text === 'Sign in') return;
          if (!isAuthenticated && opt.text === 'Sign out') return;

          else return <MenuListItem key={optIdx} listItem={opt}/>
        })}
</ul>
  )
}

export default MenuList;