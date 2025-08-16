'use client'

import React, { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, IStage, ITask, setCurrentProject, setCurrentTask } from '@/store/projects/projects.slice';
import { deleteTask } from '@/services/projects.api';
import Modal from './Modal';
import useModals from '@/hooks/useModals';
import { setErrorMsg } from '@/store/error/error.slice';
import { ActivityType } from '@/utils/types';
import { IUser } from '@/store/auth/auth.slice';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { getSocket } from '@/utils/socket';
import { prepend } from '@/utils/utils';

const DeleteTaskPrompt = () => {
    const {currentProject, currentTask, currentStage} = useProjects();
    const {isDeleteTaskModalOpen, closeDeleteTaskModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user} = useAuth();
    const socket = getSocket();

    const dispatch = useAppDispatch();

    // Handle task deletion
    const handleDeleteTask = useCallback(async (): Promise<void> => {
        if (!currentTask) {
            dispatch(setErrorMsg('Failed deleting task'));
            return;
        }

        try {
            const updatedStages: IStage[] = currentProject?.stages.map(
                (stage: IStage) => {
                    const updatedStageTasks = stage.tasks.filter((t: ITask) => t.taskId !== currentTask.taskId);
    
                    if (stage.stageId === currentStage?.stageId) {
                        return {
                            ...stage,
                            tasks: updatedStageTasks
                        };
                    } else return stage;
                }
            ) as IStage[];
    
            const updatedCurrentProject: IProject = {
                ...currentProject,
                stages: updatedStages,
            } as IProject;
    
            await deleteTask(currentTask.taskId);
    
            socket?.emit('deleteTask', {...currentTask, lastUpdatedBy: user?.userId as string});
            
            dispatch(setCurrentProject(updatedCurrentProject));
    
            dispatch(setCurrentTask(null));
    
            closeDeleteTaskModal();
    
            const activityLog = await createNewActivity(
                ActivityType.DeleteTask,
                user as IUser,
                currentTask as ITask,
                currentProject?.projectId as string
            );
            
            dispatch(setActivities(prepend(activityLog, activities)));
        } catch (error) {
            console.error(error);
            dispatch(setErrorMsg("Failed deleting task"));
        }
        
    }, [
        activities,
        currentProject, 
        currentStage,
        currentTask,
        user,
        dispatch, 
        closeDeleteTaskModal,
        createNewActivity,
        socket,
    ]);

  return (
    <Modal
        title={`Delete ${currentTask?.title}`}
        onSubmit={handleDeleteTask}
        onClose={closeDeleteTaskModal}
        isOpen={isDeleteTaskModalOpen}
        noteBelowContent
        optionalNote={`You are deleting ${currentTask?.title} and all of its contents.`}
        submitBtnStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'
        closeBtnStyles='hover:bg-slate-200'
        submitBtnText='Yes, delete'
    >
        <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
        <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
    </Modal>
  )
}

export default DeleteTaskPrompt;