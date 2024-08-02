'use client'

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = {
    children: ReactNode;
    action?: () => void;
    type?: 'submit' | 'reset' | 'button';
    additionalStyles?: string;
    disabled?: boolean;
    withIcon?: boolean;
    icon?: ReactNode;
}

const Button = ({
  children,
  action = () => {},
  additionalStyles,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
        type={type}
        onClick={action}
        disabled={disabled}
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
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${additionalStyles}
        `)}
    >
        {children}
    </button>
  )
}

export default Button;