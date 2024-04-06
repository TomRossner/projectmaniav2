'use client'

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
interface ITaskMenuOption {
    option: string;
    action: () => void;
    icon?: ReactNode;
    additionalStyles?: string;
}

const TaskMenuOption = ({option, action, icon, additionalStyles}: ITaskMenuOption) => {
  return (
    <li
      onClick={action}
      className={twMerge(`
        hover:bg-slate-100
        cursor-pointer
        w-full
        px-1
        rounded-bl-lg
        flex
        gap-2
        items-center
        ${additionalStyles}
      `)}
    >
        {icon}
        {option}
    </li>
  )
}

export default TaskMenuOption;