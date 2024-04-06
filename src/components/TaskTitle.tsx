import React from 'react';
import { twMerge } from 'tailwind-merge';

const TaskTitle = ({title, additionalStyles}: {title: string, additionalStyles?: string}) => {
    
  return (
    <p
      className={twMerge(`
        font-medium
        text-xl
        text-left
        ${additionalStyles}
      `)}
    >
      {title}
    </p>
  )
}

export default TaskTitle;