'use client'

import { TASK_MENU_OPTIONS } from '@/utils/constants';
import React from 'react';
import TaskMenuOption from './TaskMenuOption';
import { useAppDispatch } from '@/hooks/hooks';
import { closeEditTaskModal, openDeleteTaskPrompt, openEditTaskModal } from '@/store/app/app.slice';

interface ITaskMenuProps {
    setIsMenuOpen: (bool: boolean) => void;
}

const TaskMenu = ({setIsMenuOpen}: ITaskMenuProps) => {
    const dispatch = useAppDispatch();

    const openEditModal = () => {
        dispatch(openEditTaskModal());
    }

    const closeEditModal = () => {
        dispatch(closeEditTaskModal());
    }

    const handleDelete = () => {
        dispatch(openDeleteTaskPrompt());
    }
    
    const handleOptionClick = (opt: string): void => {
        setIsMenuOpen(false);
        switch (opt.toLowerCase()) {
            case 'edit':
                return openEditModal();
            case 'delete':
                return handleDelete();
            default:
                return closeEditModal();
        }
    }
    
  return (
    <ul className='w-[100px] absolute bottom-[-50px] right-2 bg-white border border-black rounded-bl-lg flex flex-col p-1'>
        {TASK_MENU_OPTIONS.map((option: string) => 
            <TaskMenuOption key={option} action={() => handleOptionClick(option)} option={option}/>
        )}
    </ul>
  )
}

export default TaskMenu;