'use client'

import React, { ReactNode } from 'react';
import { Tooltip, TooltipProps } from '@greguintow/react-tippy';
import { twMerge } from 'tailwind-merge';

interface ButtonWithIconProps {
    icon: ReactNode;
    title?: string;
    action?: () => void;
    state?: any;
    additionalStylesForState?: string;
    additionalStyles?: string;
    disabled?: boolean;
    disabledStyles?: string;
    tooltipProps?: TooltipProps;
}

const ButtonWithIcon = ({
  icon,
  title,
  action,
  state,
  additionalStylesForState,
  additionalStyles,
  disabled,
  disabledStyles,
  tooltipProps = {
    arrow: true,
    position: 'top',
    animation: 'scale',
    duration: 150,
    disabled,
    theme: 'dark',
    inertia: true,
  }
}: ButtonWithIconProps) => {
  
  const {
    animation,
    arrow,
    inertia,
    position,
    theme,
    ...rest
  } = tooltipProps;

  return (
    <Tooltip
      arrow={arrow}
      inertia={inertia}
      position={position}
      animation={animation}
      theme={theme}
      title={title}
      disabled={disabled}
      {...rest}
    >  
      <button
          type='button'
          disabled={disabled}
          onClick={action}
          className={twMerge(`
              flex
              items-center
              cursor-pointer
              rounded-sm
              p-1
              border
              text-lg
              text-slate-400
              border-slate-300
              active:border-slate-600
              active:text-slate-600
              sm:hover:border-slate-600
              sm:hover:text-slate-600
              ${disabledStyles}
              ${additionalStyles}
              ${state && additionalStylesForState}
          `)}
      >
        {icon as ReactNode}
      </button>
    </Tooltip>
  )
}

export default ButtonWithIcon;