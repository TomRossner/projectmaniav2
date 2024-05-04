'use client'

import React, { ReactNode } from 'react';
import { TooltipProps } from '@greguintow/react-tippy';
import { twMerge } from 'tailwind-merge';
import ToolTip from './ToolTip';
import { DEFAULT_TOOLTIP_PROPS } from '@/utils/constants';

type ButtonWithIconProps = {
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
  tooltipProps = DEFAULT_TOOLTIP_PROPS
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
    <ToolTip
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
              rounded-sm
              p-1
              border
              text-lg
              cursor-pointer
              disabled:cursor-not-allowed
              text-slate-400
              border-slate-300
              active:border-slate-600
              active:text-slate-600
              sm:hover:border-slate-600
              sm:hover:text-slate-600
              disabled:border-slate-200
              disabled:text-slate-300
              ${disabledStyles}
              ${additionalStyles}
              ${state && additionalStylesForState}
          `)}
      >
        {icon as ReactNode}
      </button>
    </ToolTip>
  )
}

export default ButtonWithIcon;