'use client'

import { TPriority } from '@/store/projects/projects.slice';
import React from 'react';

const TaskPriority = ({priority}: {priority: TPriority}) => {
  
  const setPriorityColor = (priority: TPriority): string => {
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
    <div className={`${setPriorityColor(priority)} pt-1 text-white rounded-bl-lg self-end flex items-end w-[70px] border border-slate-500`}>
        <p className='w-full text-center self-end'>{priority.toUpperCase()}</p>
    </div>
  )
}

export default TaskPriority;