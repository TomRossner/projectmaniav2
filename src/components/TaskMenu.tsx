'use client'

import { TASK_MENU_OPTIONS } from '@/utils/constants';
import React, { ForwardedRef, forwardRef, useCallback, useRef } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { IProject, IStage, ITask, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import MoreOptions from './common/MoreOptions';
import { ActivityType, TOption } from '@/utils/types';
import useModals from '@/hooks/useModals';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { IUser } from '@/store/auth/auth.slice';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';
import { getSocket } from '@/utils/socket';

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
    const {openBackLayer, openEditTaskModal, closeEditTaskModal, openDeleteTaskModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user, userId} = useAuth();
    const socket = getSocket();
    
    const openEditModal = () => {
        openBackLayer();
        openEditTaskModal();
    }

    const closeEditModal = () => {
        closeEditTaskModal();
    }

    const handleDelete = () => {
        openDeleteTaskModal();
    }

    const handleIsDone = useCallback(async (task: ITask) => {
        const {taskId} = task;

        const updatedTask: ITask = {
            ...task,
            isDone: !task.isDone,
            lastUpdatedBy: user?.userId as string,
        }

        const updatedTasks: ITask[] = currentStage?.tasks.map(t => {
            if (t.taskId === taskId) {
                return updatedTask;
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

        const activityLog =  await createNewActivity(
            ActivityType.UpdateIsDone,
            user as IUser,
            currentTask as ITask,
            currentProject?.projectId as string
        );
        
        dispatch(setCurrentProject(updatedProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

        socket?.emit('updateTask', updatedTask);
    }, [
        activities,
        dispatch,
        currentProject,
        currentStage,
        currentTask,
        user,
        createNewActivity
    ]);
    
    const handleOptionClick = (opt: TOption): void => {
        setIsMenuOpen(false);

        switch (opt.text.toLowerCase()) {
            case 'done':
                handleIsDone(currentTask as ITask);
                break;
            case 'reset':
                handleIsDone(currentTask as ITask);
                break;
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