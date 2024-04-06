import { TLabel } from '@/utils/types';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ITaskLabel {
    text: TLabel;
    additionalStyles?: string; 
}

const TaskLabel = ({text, additionalStyles}: ITaskLabel) => {
  return (
    <div
        className={twMerge(`
            min-w-[100px]
            rounded-bl-lg
            text-white
            border
            shadow-sm
            text-center
            self-stretch
            pt-1
            cursor-default
            select-none
            ${text === 'bug' && 'bg-orange-400 border-orange-600'}
            ${text === 'completed' && 'bg-green-500 border-green-600'}
            ${additionalStyles}
        `)}
    >
      {text.toUpperCase()}
    </div>
  )
}

export default TaskLabel;