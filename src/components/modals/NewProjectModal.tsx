'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { closeNewProjectModal, setError } from '@/store/app/app.slice';
import React, { useState } from 'react';
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Input from '../common/Input';
import Line from '../common/Line';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { IBaseProject, IProject, ITeamMember, setProjects } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import { createProject } from '@/services/projects.api';
import useModals from '@/hooks/useModals';
import useAuth from '@/hooks/useAuth';

const NewProjectModal = () => {
    const {newProjectModalOpen} = useModals();

    const {currentProject, projects} = useProjects();

    const {user} = useAuth();

    const [inputValues, setInputValues] = useState<IBaseProject | Partial<IProject>>(DEFAULT_PROJECT);

    const dispatch = useAppDispatch();

    const handleCreate = async (newProjectData: IBaseProject | Partial<IProject>): Promise<void> => {
       try {
        dispatch(setError(null));

        const self: ITeamMember = {
            email: user?.email,
            userId: user?.userId,
            firstName: user?.firstName,
            lastName: user?.lastName
        } as ITeamMember;

        const newProject: Partial<IProject> = {
            ...newProjectData,
            team: [self]
        }

        const response = await createProject(newProject);

        dispatch(setProjects([...projects, response.data as IProject]));

        handleClose();
       } catch (error: any) {
        if (error.response) {
            dispatch(setError(error.response.data.error));
            return;
        } else dispatch(setError('Failed creating project'));
       }
    }

    const handleClose = (): void => {
        dispatch(closeNewProjectModal());
        setInputValues(DEFAULT_PROJECT);
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValues({...inputValues, [ev.target.name]: ev.target.value});
    }
    
  return (
    <>
    {newProjectModalOpen && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-40'>
        <div id='newProjectModal' className='min-w-[350px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col gap-1 drop-shadow-md'>
            <ModalTitle text='Create a project'/>
            
            <Line additionalStyles='pb-2'/>
            
            <div className='flex flex-col h-full w-full'>
                <Input
                    id='title'
                    type='text'
                    name='title'
                    onChange={handleInputChange}
                    value={inputValues.title}
                    labelText='Title'
                    additionalStyles='mb-4'
                />

            </div>
            
            <Line additionalStyles='pb-1'/> 
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Create' action={() => handleCreate(inputValues)} additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={handleClose} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>

            <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
                <span className='font-semibold'>NOTE: </span>
                This will create a brand new project.
            </p>
        </div>
    </div>}
    </>
  )
}

export default NewProjectModal;