'use client'

import useModals from '@/hooks/useModals';
import React from 'react';
import { BiPlus } from 'react-icons/bi';

const BigPlus = () => {
  const {openNewTaskModal} = useModals();

  return (
    <span
      onClick={openNewTaskModal}
      className='
        flex
        items-center
        justify-center
        w-1/2
        text-[120px]
        p-5
        py-12
        text-slate-200
        rounded-bl-3xl
        border-dashed
        border-2
        border-slate-200
        bg-slate-50
        cursor-pointer
        transition-all
        opacity-80
        hover:border-slate-300
        hover:opacity-90
        hover:shadow-sm
        hover:text-slate-300
    '>
        <BiPlus />
    </span>
  )
}

export default BigPlus;