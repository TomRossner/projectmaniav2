'use client'

import React, { useState } from 'react';
import TaskTitle from './TaskTitle';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BsThreeDots } from 'react-icons/bs';
import TaskMenu from './TaskMenu';
import { ITask, setCurrentTask } from '@/store/projects/projects.slice';
import { useAppDispatch } from '@/hooks/hooks';

const TaskTop = ({title, task}: {title: string, task: ITask}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleMenu = () => {
    dispatch(setCurrentTask(task));
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className='flex items-center w-full justify-between relative'>
        <TaskTitle title={title}/>
        <ButtonWithIcon icon={<BsThreeDots/>} action={toggleMenu}/>

        {isMenuOpen && <TaskMenu setIsMenuOpen={setIsMenuOpen}/>}
    </div>
  )
}

export default TaskTop;