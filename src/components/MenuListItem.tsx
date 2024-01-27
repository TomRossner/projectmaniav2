'use client'

import React, { ReactNode } from 'react';
import { IMenuItem } from './MobileMenu';
import Image from 'next/image';
import Link from 'next/link';
import { LINKS } from '@/utils/links';
import { SPACES_AND_DASHES_PATTERN } from '@/utils/regexp';
import useAuth from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

interface IMenuListItemProps {
    listItem: IMenuItem
}

const MenuListItem = ({listItem}: IMenuListItemProps) => {
  const {text, action, imageSrc, icon} = listItem;
  const {user} = useAuth();
  
  
  const currentPath = usePathname();
  // console.log(currentPath)

  const checkActivePath = (text: string): string | null => {
    const formattedPath = text.replaceAll(SPACES_AND_DASHES_PATTERN, "_").toUpperCase();

    if (currentPath === LINKS[formattedPath]) {
      return 'text-blue-500 bg-slate-50';
    } else return null;
  }

  const getLink = (text: string): string => {
    try {
      const formattedPath = text.replaceAll(SPACES_AND_DASHES_PATTERN, "_").toUpperCase();

      const userName = `${user?.firstName}_${user?.lastName}`;

      if (formattedPath === userName.toUpperCase()) {
        return user ? LINKS['PROFILE'] : LINKS[formattedPath];
      }

      return LINKS[formattedPath];
    } catch (error) {
      console.error(error);
      return LINKS['NOT_FOUND'];
    }
  }

  return (
    <Link
      href={getLink(text)}
      onClick={action}
      className={`
        flex
        gap-4
        items-center
        cursor-pointer
        px-4
        py-2
        w-full
        rounded-bl-lg
        text-slate-400
        text-2xl
        text-left
        hover:bg-slate-50
        hover:text-blue-500
        ${checkActivePath(text)}
      `}
    >
        {
          icon &&
          !imageSrc && (
            <span className={`${checkActivePath(text)} text-md`}>
              {icon as ReactNode}
            </span>
          )
        }

        {imageSrc &&
          <Image
            src={imageSrc}
            alt={text}
            className='rounded-full aspect-square'
            width={25}
            height={25}
          />
        }
        
        <span className={`pt-1 ${checkActivePath(text)}`}>
          {text}
        </span>
    </Link>
  )
}

export default MenuListItem;