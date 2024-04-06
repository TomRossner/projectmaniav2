'use client'

import React from 'react';
import { twMerge } from 'tailwind-merge';
interface IButtonProps {
    text: string;
    action?: () => void;
    type?: 'submit' | 'reset' | 'button' | undefined;
    additionalStyles?: string;
}

const Button = ({text, action, additionalStyles, type}: IButtonProps) => {
  return (
    <button
        type={type ? type : 'button'}
        onClick={action}
        className={twMerge(`
          px-2
          py-1
          text-lg
          text-center
          font-medium
          border
          border-stone-500
          w-1/3
          self-end
          ${additionalStyles}
        `)}
    >
        {text}
    </button>
  )
}

export default Button;