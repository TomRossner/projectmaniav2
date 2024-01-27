'use client'

import { TPriority } from '@/store/projects/projects.slice';
import React from 'react';

const TaskPriority = ({priority}: {priority: TPriority}) => {
  return (
    <div className='rounded-bl-lg self-end flex items-end w-[70px] border border-slate-500'>
        <p className='w-full text-center self-end'>{priority.toUpperCase()}</p>
    </div>
  )
}

export default TaskPriority;