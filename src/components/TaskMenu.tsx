'use client'

import { TASK_MENU_OPTIONS } from '@/utils/constants';
import React, { ForwardedRef, forwardRef, useRef } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { closeEditTaskModal, openBackLayer, openDeleteTaskPrompt, openEditTaskModal } from '@/store/app/app.slice';
import { IProject, IStage, ITask, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import MoreOptions from './common/MoreOptions';
import { TOption } from '@/utils/types';

type TaskMenuProps = {
    setIsMenuOpen: (bool: boolean) => void;
    menuOpen: boolean;
    closeOnClickOutside?: boolean;
    toggleMenu: () => void;
}

const TaskMenu = forwardRef(function TaskMenu(props: TaskMenuProps, ref: ForwardedRef<HTMLElement>) {
    const {
        setIsMenuOpen,
        menuOpen,
        toggleMenu,
    } = props;

    // useOnClickOutside([menuRef], (toggleMenu));

    const dispatch = useAppDispatch();
    const {currentTask, currentStage, currentProject} = useProjects();
    
    const openEditModal = () => {
        dispatch(openBackLayer());
        dispatch(openEditTaskModal());
    }

    const closeEditModal = () => {
        dispatch(closeEditTaskModal());
    }

    const handleDelete = () => {
        dispatch(openDeleteTaskPrompt());
    }

    const handleIsDone = (task: ITask): void => {
        const {taskId} = task;

        const updatedTasks: ITask[] = currentStage?.tasks.map(t => {
            if (t.taskId === taskId) {
                return {
                    ...task,
                    isDone: !t.isDone
                }
            } else return t;
        }) as ITask[];

        const updatedStage: IStage = {
            ...currentStage,
            tasks: updatedTasks
        } as IStage;

        const updatedStages: IStage[] = currentProject?.stages.map(s => {
            if (s.stageId === currentStage?.stageId) {
                return updatedStage
            } else return s;
        }) as IStage[];

        const updatedProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedProject));
    }
    
    const handleOptionClick = (opt: TOption): void => {
        setIsMenuOpen(false);

        switch (opt.text.toLowerCase()) {
            case 'done':
                return handleIsDone(currentTask as ITask);
            case 'reset':
                return handleIsDone(currentTask as ITask);
            case 'edit':
                return openEditModal();
            case 'delete':
                return handleDelete();
            default:
                return closeEditModal();
        }
    }
    
  return (
    <MoreOptions
        isOpen={menuOpen}
        setIsOpen={setIsMenuOpen}
        options={TASK_MENU_OPTIONS}
        action={handleOptionClick}
    />
  )
})

export default TaskMenu;