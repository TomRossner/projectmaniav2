'use client'

import React from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteTaskPrompt, setError } from '@/store/app/app.slice';
import useProjects from '@/hooks/useProjects';
import { IProject, IStage, ITask, setCurrentProject, setCurrentTask } from '@/store/projects/projects.slice';
import usePrompts from '@/hooks/usePrompts';
import { deleteTask } from '@/services/projects.api';
import Modal from './Modal';

const DeleteTaskPrompt = () => {
    const {currentProject, currentTask, currentStage} = useProjects();
    const {deleteTaskPromptOpen} = usePrompts();

    const dispatch = useAppDispatch();

    const closePrompt = (): void => {
        dispatch(closeDeleteTaskPrompt());
    }

    // Handle stage deletion
    const handleDeleteTask = async (): Promise<void> => {
        if (!currentTask) {
            dispatch(setError('Failed deleting task'));
            return;
        }
        
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
            stages: updatedStages
        } as IProject;

        await deleteTask(currentTask.taskId);

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setCurrentTask(null));


        closePrompt();
    }

  return (
    <Modal
        title={`Delete ${currentTask?.title}`}
        onSubmit={handleDeleteTask}
        onClose={closePrompt}
        isOpen={deleteTaskPromptOpen}
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