'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
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
import { prepend } from '@/utils/utils';

const NewProjectModal = () => {
    const dispatch = useAppDispatch();
    const {isNewProjectModalOpen, closeNewProjectModal} = useModals();
    const {projects, handleError} = useProjects();
    const {user} = useAuth();
    const {createNewActivity, activities} = useActivityLog();

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const [inputValues, setInputValues] = useState<NewProjectData>(DEFAULT_PROJECT);

    const handleClose = useCallback(() => {
        closeNewProjectModal();
        setInputValues(DEFAULT_PROJECT);
    }, [closeNewProjectModal])

    const handleCreate = useCallback(async (ev: FormEvent<HTMLFormElement>, newProjectData: NewProjectData) => {
        try {
            ev.preventDefault();

            dispatch(setErrorMsg(null));
    
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
    
            const response = await createProject(newProject);
            
            
            dispatch(setProjects([
                ...projects,
                response.data as IProject
            ]));
            
            handleClose();
            
            dispatch(setProjects([
                ...projects,
                response.data as IProject
            ]));
    
            handleClose();
            
            const activityLog = await createNewActivity(
                ActivityType.CreateProject,
                user as IUser,
                response.data as IProject,
                response.data.projectId as string
            );

            dispatch(setActivities(prepend(activityLog, activities)));
        } catch (error: unknown) {
            handleError(error as AxiosError<unknown>);
        }
     }, [
        activities,
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

    useEffect(() => {
        if (isNewProjectModalOpen) {
            titleInputRef.current?.focus();
        }
    }, [isNewProjectModalOpen])
    
  return (
    <Modal
        title='Create a project'
        onSubmit={(ev: FormEvent<HTMLFormElement>) => handleCreate(ev, inputValues)}
        onClose={handleClose}
        submitBtnText='Create'
        submitBtnType='submit'
        optionalNote="This will create a brand new project"
        isOpen={isNewProjectModalOpen}
    >
        <form className='flex flex-col w-full' onSubmit={(ev) => handleCreate(ev, inputValues)}>
            <Input
                id='title'
                type='text'
                name='title'
                onChange={handleInputChange}
                value={inputValues.title}
                labelText='Title'
                additionalStyles='mb-4'
                ref={titleInputRef}
            />
        </form>
    </Modal>
  )
}

export default NewProjectModal;