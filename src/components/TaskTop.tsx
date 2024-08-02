'use client'

import React, { ForwardedRef, forwardRef, useState } from 'react';
import TaskTitle from './TaskTitle';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BsThreeDots } from 'react-icons/bs';
import TaskMenu from './TaskMenu';
import { ITask, setCurrentTask } from '@/store/projects/projects.slice';
import { useAppDispatch } from '@/hooks/hooks';

type TaskTopProps = {
  title: string;
  task: ITask;
  additionalStyles?: string;
}

const TaskTop = forwardRef(function TaskTop({
  title,
  task,
  additionalStyles
}: TaskTopProps, ref: ForwardedRef<HTMLElement>) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleMenu = (): void => {
    dispatch(setCurrentTask(task));
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className='flex items-center w-full justify-between relative'>
        <TaskTitle
          title={title}
          additionalStyles={additionalStyles}
        />

        <ButtonWithIcon
          icon={<BsThreeDots />}
          action={toggleMenu}
          additionalStyles='bg-slate-100 hover:bg-slate-50 transition-color'
          title='More options'
        />

        <TaskMenu
          setIsMenuOpen={setIsMenuOpen}
          menuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          ref={ref}
        />
    </div>
  )
});

export default TaskTop;