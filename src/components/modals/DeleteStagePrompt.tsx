'use client'

import React from 'react';
import Button from '../common/Button';
import useDeleteStagePrompt from '@/hooks/usePrompts';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteStagePrompt, setError } from '@/store/app/app.slice';
import ModalTitle from './ModalTitle';
import useProjects from '@/hooks/useProjects';
import Line from '../common/Line';
import { IProject, IStage, setCurrentProject, setCurrentStageIndex } from '@/store/projects/projects.slice';
import Modal from './Modal';

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
    <Modal
        title={`Delete ${currentStage?.title}`}
        onSubmit={handleDeleteStage}
        onClose={closePrompt}
        isOpen={deleteStagePromptOpen}
        optionalNote={`You are deleting ${currentStage?.title} and all of its contents.`}
        submitBtnStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'
        closeBtnStyles='hover:bg-slate-200'
        submitBtnText='Yes, delete'
        noteBelowContent
    >
        <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
        <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
    </Modal>
  )
}

export default DeleteStagePrompt;