'use client'

import React from 'react';
import Button from '../common/Button';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteTaskPrompt, setError } from '@/store/app/app.slice';
import ModalTitle from './ModalTitle';
import useProjects from '@/hooks/useProjects';
import Line from '../common/Line';
import { IProject, IStage, ITask, setCurrentProject, setCurrentTask } from '@/store/projects/projects.slice';
import usePrompts from '@/hooks/usePrompts';
import { deleteTask } from '@/services/projects.api';

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
    <>
    {deleteTaskPromptOpen && currentTask && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
            <ModalTitle text={`Delete ${currentTask?.title}`}/>

            <Line additionalStyles='pb-3'/>

            <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
            <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
            <p className='italic text-stone-500 text-center'>
                <span className='font-semibold text-stone-500'>NOTE: </span>
                You are deleting {currentTask?.title} and all of its contents.
            </p>
            
            <Line additionalStyles='py-1'/>

            <div className='flex items-center gap-1 justify-end'>
                <Button text='Yes, delete' action={handleDeleteTask} additionalStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'/>
                <Button text='Cancel' action={closePrompt} additionalStyles='hover:bg-slate-200'/>
            </div>
        </div>
    </div>}
    </>
  )
}

export default DeleteTaskPrompt;