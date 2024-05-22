'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { closeNewProjectModal, setError } from '@/store/app/app.slice';
import React, { useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { IBaseProject, IProject, ITeamMember, setProjects } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import { createProject } from '@/services/projects.api';
import useModals from '@/hooks/useModals';
import useAuth from '@/hooks/useAuth';
import Modal from './Modal';

const NewProjectModal = () => {
    const {newProjectModalOpen} = useModals();

    const { projects} = useProjects();

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
        <Modal
            title='Create a project'
            onSubmit={() => handleCreate(inputValues)}
            onClose={handleClose}
            submitBtnText='Create'
            optionalNote="This will create a brand new project"
            isOpen={newProjectModalOpen}
        >
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
        </Modal>
    </>
  )
}

export default NewProjectModal;