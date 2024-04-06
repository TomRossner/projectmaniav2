'use client'

import React from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteProjectPrompt, setError } from '@/store/app/app.slice';
import useProjects from '@/hooks/useProjects';
import { IProject, setCurrentProject, setProjects } from '@/store/projects/projects.slice';
import usePrompts from '@/hooks/usePrompts';
import { deleteProject } from '@/services/projects.api';
import Modal from './Modal';

const DeleteProjectPrompt = () => {
    const {deleteProjectPromptOpen} = usePrompts();
    const {currentProject, projects} = useProjects();

    const dispatch = useAppDispatch();

    const closePrompt = (): void => {
        dispatch(closeDeleteProjectPrompt());
    }

    // Handle project deletion
    const handleDeleteProject = async (): Promise<void> => {
        try {
            if (!currentProject) {
                dispatch(setError('Failed deleting project'));
                return;
            }
            
            await deleteProject(currentProject.projectId);
            
            dispatch(setProjects([
                ...projects.filter((project: IProject) =>
                    project.projectId !== currentProject?.projectId
                )
            ]));

            dispatch(setCurrentProject(null));
            closePrompt();  
    
        } catch (error: any) {
            console.error(error);

            if (error.response) {
                dispatch(setError(error.response.data.error));
                return;
            } else dispatch(setError('Failed deleting project'));
        }
    }

  return (
    <Modal
        title={`Delete ${currentProject?.title}`}
        onSubmit={handleDeleteProject}
        onClose={closePrompt}
        submitBtnText='Yes, delete'
        isOpen={deleteProjectPromptOpen}
        optionalNote={`You are deleting ${currentProject?.title} and all of its contents.`}
        submitBtnStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'
        closeBtnStyles='hover:bg-slate-200'
        noteBelowContent
    >
        <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
        <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
    </Modal>
  )
}

export default DeleteProjectPrompt;