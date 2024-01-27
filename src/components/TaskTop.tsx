'use client'

import React from 'react';
import TaskTitle from './TaskTitle';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BsThreeDots } from 'react-icons/bs';

const TaskTop = ({title}: {title: string}) => {
  return (
    <div className='flex items-center w-full justify-between'>
        <TaskTitle title={title}/>
        <ButtonWithIcon icon={<BsThreeDots/>}/>
    </div>
  )
}

export default TaskTop;