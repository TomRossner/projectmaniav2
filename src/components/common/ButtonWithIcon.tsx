'use client'

import React, { MouseEvent, ReactNode } from 'react';
import { TooltipProps } from '@greguintow/react-tippy';
import { twMerge } from 'tailwind-merge';
import ToolTip from './ToolTip';
import { DEFAULT_TOOLTIP_PROPS } from '@/utils/constants';
import { BsCircleFill } from 'react-icons/bs';
import ItemCount from './ItemCount';

type ButtonWithIconProps = {
    icon: ReactNode;
    title?: string;
    action?: () => void;
    state?: unknown;
    additionalStylesForState?: string;
    additionalStyles?: string;
    disabled?: boolean;
    disabledStyles?: string;
    tooltipProps?: TooltipProps;
    withTooltip?: boolean;
    withCount?: boolean;
    itemCount?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
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
  tooltipProps = DEFAULT_TOOLTIP_PROPS,
  withTooltip = true,
  withCount = false,
  itemCount = 0,
  onMouseEnter,
  onMouseLeave,
}: ButtonWithIconProps) => {
  
  const {
    animation,
    arrow,
    inertia,
    position,
    theme,
    ...rest
  } = tooltipProps;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (action) {
      action();
    }
  }

  return (
    <>
    {withTooltip ? (
      <ToolTip
        arrow={arrow}
        inertia={inertia}
        position={position}
        animation={animation}
        theme={theme}
        title={title}
        disabled={disabled}
        {...rest}
        className='h-full'
      >  
        <button
          type='button'
          disabled={disabled}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={twMerge(`
            flex
            items-center
            rounded-sm
            p-1
            border
            text-lg
            relative
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
          {withCount && (
            <ItemCount
              count={itemCount as number}
              disabled={disabled}
            />
          )}
          {icon}
        </button>
      </ToolTip>
    ) : (
      <button
        type='button'
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
        {icon}
      </button>
    )}
    </>
  )
}

export default ButtonWithIcon;