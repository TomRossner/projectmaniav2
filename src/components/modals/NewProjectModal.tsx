'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { useCallback, useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { NewProjectData, IProject, TeamMember, setProjects } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import { createProject } from '@/services/projects.api';
import useModals from '@/hooks/useModals';
import useAuth from '@/hooks/useAuth';
import Modal from './Modal';
import { AxiosError } from 'axios';
import { setErrorMsg } from '@/store/error/error.slice';
import useActivityLog from '@/hooks/useActivityLog';
import { ActivityType } from '@/utils/types';
import { IUser } from '@/store/auth/auth.slice';
import { setActivities } from '@/store/activity_log/activity_log.slice';

const NewProjectModal = () => {
    const dispatch = useAppDispatch();
    const {isNewProjectModalOpen, closeNewProjectModal} = useModals();
    const {projects, handleError} = useProjects();
    const {user} = useAuth();
    const {createNewActivity, activities} = useActivityLog();

    const [inputValues, setInputValues] = useState<NewProjectData>(DEFAULT_PROJECT);

    const handleClose = useCallback(() => {
        closeNewProjectModal();
        setInputValues(DEFAULT_PROJECT);
    }, [closeNewProjectModal])

    const handleCreate = useCallback(async (newProjectData: NewProjectData) => {
        try {
            dispatch(setErrorMsg(null));
    
            console.log({newProjectData})
    
            const self: TeamMember = {
                email: user?.email,
                userId: user?.userId,
                firstName: user?.firstName,
                lastName: user?.lastName,
                imgSrc: user?.imgSrc,
                isOnline: user?.isOnline
            } as TeamMember;
    
            
            let newProject: NewProjectData = {
                ...newProjectData,
                team: [self],
                createdBy: user?.userId as string,
                lastUpdatedBy: user?.userId as string,
                stages: [],
                activities: [],
            }

            console.log({newProject})
    
            const response = await createProject(newProject);
            
            const activityLog =  await createNewActivity(
                ActivityType.CreateProject,
                user as IUser,
                response.data as IProject,
                response.data.projectId as string
            );
    
            dispatch(setProjects([
                ...projects,
                response.data as IProject
            ]));
            dispatch(setActivities([
                ...activities,
                activityLog
            ]));
    
            handleClose();
    
            dispatch(setProjects([
                ...projects,
                response.data as IProject
            ]));
    
            handleClose();
        } catch (error: unknown) {
            handleError(error as AxiosError<unknown>);
        }
     }, [activities,
        dispatch,
        projects,
        handleClose,
        handleError,
        createNewActivity,
        user
     ]);

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        setInputValues(inputValues => ({...inputValues, [name]: value}));
    }
    
  return (
    <Modal
        title='Create a project'
        onSubmit={() => handleCreate(inputValues)}
        onClose={handleClose}
        submitBtnText='Create'
        optionalNote="This will create a brand new project"
        isOpen={isNewProjectModalOpen}
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
  )
}

export default NewProjectModal;