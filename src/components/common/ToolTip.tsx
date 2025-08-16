import useWindowDimensions from '@/hooks/useWindowDimensions';
import { SCREEN_SIZES } from '@/utils/constants';
import { Tooltip, TooltipProps } from '@greguintow/react-tippy';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const ToolTip = ({
    arrow,
    inertia,
    delay = 50,
    duration = 150,
    position = "top",
    animation = "scale",
    disabled = false,
    title,
    className,
    children,
}: TooltipProps) => {
  const {width} = useWindowDimensions();
  
  return (
    <Tooltip
      arrow={arrow}
      delay={delay}
      duration={duration}
      position={position}
      inertia={inertia}
      animation={animation}
      disabled={(!!width && (width < SCREEN_SIZES["md"])) || disabled}
      title={title}
      className={twMerge(
          className,
      )}
    >
      {children}
    </Tooltip>
  )
}

export default ToolTip;