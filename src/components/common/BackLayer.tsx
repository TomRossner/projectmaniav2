'use client'

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type BackLayerProps = {
  title: string;
  children: ReactNode;
  action?: () => void;
  closeOnClick?: boolean;
  zIndex?: string;
}

const BackLayer = ({
  title,
  children,
  closeOnClick = false,
  action,
  zIndex,
}: BackLayerProps) => {
  
  const handleClick = () => {
    if (closeOnClick && action) {
      action();
    }
  }

  return (
    <div
      id='modal_back_layer'
      onClick={handleClick}
      className={twMerge(`
          w-screen
          min-h-screen
          absolute
          top-0
          left-0
          right-0
          m-auto
          flex
          items-center
          justify-center
          overflow-y-hidden
          ${zIndex}
          ${title === 'Error'
            ? 'z-40'
            : 'z-30'
          }
      `)}
    >
      {children}
    </div>
  )
}

export default BackLayer;