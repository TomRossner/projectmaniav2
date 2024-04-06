'use client'

import { Priority } from '@/store/projects/projects.slice';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const TaskPriority = ({priority}: {priority: Priority}) => {
  
  const setPriorityColor = (priority: Priority): string => {
    switch (priority) {
        case 'low':
            return 'bg-green-400';
        case 'medium':
            return 'bg-yellow-400';
        case 'high':
            return 'bg-red-400';
        default:
            return 'bg-slate-300';
    }
  }
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
        ${setPriorityColor(priority)}
      `)}>
        <p className='w-full text-center self-end'>
          {priority.toUpperCase()}
        </p>
    </div>
  )
}

export default TaskPriority;