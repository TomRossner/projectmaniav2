'use client'

import React from 'react';
import {RxCross2} from "react-icons/rx"
import { twMerge } from 'tailwind-merge';

type CrossProps = {
    action: () => void;
    additionalStyles?: string;
}

// Close mobile menu icon

const Cross = ({action, additionalStyles}: CrossProps) => {
  return (
    <button
      type='button'
      onClick={action}
      className={twMerge(`
        cursor-pointer
        p-2
        w-10
        h-10
        z-50
        rounded-bl-lg
        flex
        items-center
        justify-center
        text-center
        text-2xl
        text-slate-500
        sm:hover:text-slate-800
        active:text-slate-800
        font-medium
        fixed
        right-2
        top-2
        bg-slate-100
        sm:hover:bg-slate-200
        active:bg-slate-200
        transition-colors
        duration-75
        ${additionalStyles}
      `)}
    >
        <RxCross2 />
    </button>
  )
}

export default Cross;