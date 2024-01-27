import React from 'react';

const TaskTitle = ({title}: {title: string}) => {
    
  return (
    <p className='font-medium text-xl text-left'>{title}</p>
  )
}

export default TaskTitle;