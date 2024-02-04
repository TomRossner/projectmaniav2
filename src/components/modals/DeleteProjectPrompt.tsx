'use client'

import React from 'react';
import Button from '../common/Button';
import { useAppDispatch } from '@/hooks/hooks';
import { closeDeleteProjectPrompt, setError } from '@/store/app/app.slice';
import ModalTitle from './ModalTitle';
import useProjects from '@/hooks/useProjects';
import Line from '../common/Line';
import { IProject, setCurrentProject, setProjects } from '@/store/projects/projects.slice';
import usePrompts from '@/hooks/usePrompts';
import { deleteProject } from '@/services/projects.api';

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
    <>
    {deleteProjectPromptOpen && currentProject && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
            <ModalTitle text={`Delete ${currentProject?.title}`}/>

            <Line additionalStyles='pb-3'/>

            <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
            <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
            <p className='italic text-stone-500 text-center'>
                <span className='font-semibold text-stone-500'>NOTE: </span>
                You are deleting {currentProject?.title} and all of its contents.
            </p>
            
            <Line additionalStyles='py-1'/>

            <div className='flex items-center gap-1 justify-end'>
                <Button text='Yes, delete' action={handleDeleteProject} additionalStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'/>
                <Button text='Cancel' action={closePrompt} additionalStyles='hover:bg-slate-200'/>
            </div>
        </div>
    </div>}
    </>
  )
}

export default DeleteProjectPrompt;