import React from 'react';
import { twMerge } from 'tailwind-merge';

type TaskTitleProps = {
  title: string;
  additionalStyles?: string;
}

const TaskTitle = ({title, additionalStyles}: TaskTitleProps) => {
    
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