'use client'

import { Priority } from '@/utils/types';
import { setPriorityColor } from '@/utils/utils';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type TaskPriorityProps = {
  priority: Priority;
  additionalStyles?: string
}

const TaskPriority = ({priority, additionalStyles}: TaskPriorityProps) => {
  return (
    <div
      className={twMerge(`
        text-white
        rounded-bl-lg
        self-center
        flex
        items-end
        min-w-[50px]
        border
        border-slate-500
        text-sm
        px-2
        ${setPriorityColor(priority)}
        ${additionalStyles}
      `)}
    >
      <p className='w-full text-center self-end'>
        {priority.toUpperCase()}
      </p>
    </div>
  )
}

export default TaskPriority;