import useWindowDimensions from '@/hooks/useWindowDimensions';
import { SCREENS } from '@/utils/constants';
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
      disabled={(!!width && (width < SCREENS["md"])) || disabled}
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