'use client'

import React from 'react';

interface IButtonProps {
    text: string;
    action: () => void;
    additionalStyles?: string;
}

const Button = ({text, action, additionalStyles}: IButtonProps) => {
  return (
    <button
        type='button'
        onClick={action}
        className={`
            ${additionalStyles}
            px-2
            py-1
            text-lg
            text-center
            font-medium
            border
            border-stone-500
            w-1/3
            self-end
        `}
    >
        {text}
    </button>
  )
}

export default Button;