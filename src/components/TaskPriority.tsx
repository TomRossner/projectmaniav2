'use client'

import { Priority } from '@/utils/types';
import { setPriorityColor } from '@/utils/utils';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type TaskPriorityProps = {
  priority: Priority;
}

const TaskPriority = ({priority}: TaskPriorityProps) => {
  return (
    <div
      className={twMerge(`
        pt-1
        text-white
        rounded-bl-lg
        self-end
        flex
        items-end
        w-[70px]
        border
        border-slate-500
        text-sm
        ${setPriorityColor(priority)}
      `)}
    >
      <p className='w-full text-center self-end'>
        {priority.toUpperCase()}
      </p>
    </div>
  )
}

export default TaskPriority;