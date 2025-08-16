import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type IconProps = {
    icon: ReactNode;
    additionalStyles?: string;
}

const Icon = ({icon, additionalStyles}: IconProps) => {
  return (
    <span
        className={twMerge(`
            ${additionalStyles}
        `)}
    >
        {icon}
    </span>
  )
}

export default Icon