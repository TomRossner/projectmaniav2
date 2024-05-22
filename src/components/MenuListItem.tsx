'use client'

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LINKS } from '@/utils/links';
import { SPACES_AND_DASHES_PATTERN } from '@/utils/regexp';
import useAuth from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { MenuItem } from '@/utils/types';

interface IMenuListItemProps {
    listItem: MenuItem;
}

const MenuListItem = ({listItem}: IMenuListItemProps) => {
  const {text, action, imageSrc, icon} = listItem;
  const {user} = useAuth();
  
  const currentPath = usePathname();

  const isActive = (text: string): boolean => {
    const formattedPath = text.replaceAll(SPACES_AND_DASHES_PATTERN, "_").toUpperCase();
    
    const isProjectPath: boolean = text.toLowerCase() === currentPath.split("/")[1];

    return (currentPath === LINKS[formattedPath]) || isProjectPath;
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

  const isSignOut: boolean = text.toLowerCase() === LINKS.SIGN_OUT.split("/")[1].replace("-", " ");

  return (
    <Link
      href={getLink(text)}
      onClick={action}
      className={twMerge(`
        flex
        gap-4
        items-center
        cursor-pointer
        px-4
        py-2
        w-full
        rounded-bl-lg
        text-2xl
        text-left
        text-slate-400
        sm:hover:bg-slate-50
        active:bg-slate-50
        ${isActive(text) && 'bg-slate-50 border-r-4 border-r-blue-500'}
        ${isSignOut
          ? 'active:text-red-400 sm:hover:text-red-400'
          : 'active:text-blue-500 sm:hover:text-blue-500'
        }
      `)}
    >
        {
          icon && !imageSrc && (
            <span className='text-md'>
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
        
        <span className='pt-1'>{text}</span>
    </Link>
  )
}

export default MenuListItem;