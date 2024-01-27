'use client'

import React, { ReactNode } from 'react';

interface ButtonWithIconProps {
    icon: ReactNode;
    title?: string;
    action?: () => void;
    state?: any;
    additionalStylesForState?: string;
    additionalStyles?: string;
    disabled?: boolean;
    disabledStyles?: string;
}

const ButtonWithIcon = ({
  icon,
  title,
  action,
  state,
  additionalStylesForState,
  additionalStyles,
  disabled,
  disabledStyles
}: ButtonWithIconProps) => {

  return (
    <button
        type='button'
        disabled={disabled}
        title={title}
        onClick={action}
        className={`
            ${additionalStyles}
            ${state ? additionalStylesForState : ''}
            flex
            items-center
            cursor-pointer
            rounded-sm
            p-1
            border
            text-lg
            text-slate-400
            border-slate-300
            hover:border-slate-600
            hover:text-slate-600
            ${disabledStyles}
        `}
    >
        {icon as ReactNode}
    </button>
  )
}

export default ButtonWithIcon;