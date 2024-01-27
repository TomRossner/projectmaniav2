'use client'

import React from 'react';
import Button from '../common/Button';
import useDeleteStagePrompt from '@/hooks/usePrompts';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteStagePrompt, setError } from '@/store/app/app.slice';
import ModalTitle from './ModalTitle';
import useProjects from '@/hooks/useProjects';
import Line from '../common/Line';
import { IProject, IStage, setCurrentProject, setCurrentStage, setCurrentStageIndex, setStages } from '@/store/projects/projects.slice';

const DeleteStagePrompt = () => {
    const {deleteStagePromptOpen} = useDeleteStagePrompt();
    const {currentStage, stages, currentProject} = useProjects();

    const dispatch = useAppDispatch();

    const closePrompt = (): void => {
        dispatch(closeDeleteStagePrompt());
    }

    // Update currentStageIndex
    const updateCurrentStageIndex = (index: number) => {
        if (index === 0) return dispatch(setCurrentStageIndex(index + 1));
        if (index === stages.length - 1) return dispatch(setCurrentStageIndex(index - 1));
        else return dispatch(setCurrentStageIndex(index - 1));
    }

    // Handle stage deletion
    const handleDeleteStage = (): void => {
        if (!currentStage) {
            dispatch(setError('Failed deleting stage'));
            return;
        }

        const currentStageIndex: number = stages.indexOf(currentStage);

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: stages.filter((stage: IStage) =>
                stage.stageId !== currentStage?.stageId
            )
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        updateCurrentStageIndex(currentStageIndex);

        closePrompt();
    }

  return (
    <>
    {deleteStagePromptOpen && currentStage && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
            <ModalTitle text={`Delete ${currentStage?.title}`}/>

            <Line additionalStyles='pb-3'/>

            <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
            <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
            <p className='italic text-stone-500 text-center'>
                <span className='font-semibold text-stone-500'>NOTE: </span>
                You are deleting {currentStage?.title} and all of its contents.
            </p>
            
            <Line additionalStyles='py-1'/>

            <div className='flex items-center gap-1 justify-end'>
                <Button text='Yes, delete' action={handleDeleteStage} additionalStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'/>
                <Button text='Cancel' action={closePrompt} additionalStyles='hover:bg-slate-200'/>
            </div>
        </div>
    </div>}
    </>
  )
}

export default DeleteStagePrompt;