'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useBackLayer from '@/hooks/useBackLayer';
import React, { ReactNode } from 'react';

interface IBackLayerProps {
  title: string;
  children: ReactNode;
}

const BackLayer = ({title, children}: IBackLayerProps) => {
  return (
    <div
      id='modal_back_layer'
      className={`
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
          ${title === 'Error'
            ? 'z-40'
            : 'z-30'
          }
          overflow-y-hidden
      `}
    >
      {children}
    </div>
  )
}

export default BackLayer;