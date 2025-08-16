'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_STAGE } from '@/utils/constants';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import { createStage } from '@/services/projects.api';
import Modal from './Modal';
import { setErrorMsg } from '@/store/error/error.slice';
import { ActivityType, NewStageData } from '@/utils/types';
import useAuth from '@/hooks/useAuth';
import useActivityLog from '@/hooks/useActivityLog';
import { IUser } from '@/store/auth/auth.slice';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import useModals from '@/hooks/useModals';
import { getSocket } from '@/utils/socket';
import { prepend } from '@/utils/utils';

const NewStageModal = () => {
    const {isNewStageModalOpen, closeNewStageModal} = useModals();
    const {currentProject, stages} = useProjects();
    const {user, userId} = useAuth();
    const {createNewActivity, activities} = useActivityLog();
    const socket = getSocket();

    const [inputValues, setInputValues] = useState<NewStageData | null>(null);

    const dispatch = useAppDispatch();

    const handleClose = useCallback(() => {
        closeNewStageModal();
        setInputValues({
            ...DEFAULT_STAGE,
            projectId: currentProject?.projectId as string,
            createdBy: userId as string,
            lastUpdatedBy: userId as string,
        });
    }, [currentProject, userId, closeNewStageModal])

    const handleCreate = useCallback(async (ev: FormEvent<HTMLFormElement>, newStageData: NewStageData) => {
        ev.preventDefault();

        if (!currentProject) {
            dispatch(setErrorMsg('Failed creating stage'));
            return;
        }

        try {
            newStageData = {
                ...newStageData, 
                lastUpdatedBy: user?.userId as string,
            }
    
            const {data: newStage} = await createStage(newStageData);
    
            const updatedCurrentProject: IProject = {
                ...currentProject,
                stages: [...stages, newStage as IStage],
            } as IProject;
    
            
            dispatch(setCurrentProject(updatedCurrentProject));
    
            socket?.emit('newStage', newStage);
    
            handleClose();
    
            const activityLog = await createNewActivity(
                ActivityType.AddStage,
                user as IUser,
                currentProject as IProject,
                currentProject?.projectId as string
            );
    
            dispatch(setActivities(prepend(activityLog, activities)));
        } catch (error) {
            console.error(error);
            dispatch(setErrorMsg("Failed creating stage"));
        }

    }, [
        activities,
        currentProject,
        user,
        createNewActivity,
        dispatch,
        stages,
        handleClose,
        socket,
    ]);

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        
        setInputValues({
            ...inputValues,
            [name]: value,
        } as NewStageData);
    }

    useEffect(() => {
        if (userId && currentProject) {
            setInputValues({
                ...DEFAULT_STAGE,
                createdBy: userId,
                projectId: currentProject.projectId,
                lastUpdatedBy: userId as string,
            });
        }
    }, [currentProject, userId])
    
  return (
    <Modal
        title='Create a stage'
        onSubmit={(ev: FormEvent<HTMLFormElement>) => handleCreate(ev, inputValues as NewStageData)}
        submitBtnType='submit'
        onClose={handleClose}
        submitBtnText='Create'
        optionalNote={`This stage will be added to ${currentProject?.title}`}
        isOpen={isNewStageModalOpen}
    >
        <form onSubmit={(ev) => handleCreate(ev, inputValues as NewStageData)} className='w-full flex flex-col'>
            <Input
                id='title'
                type='text'
                name='title'
                onChange={handleInputChange}
                value={inputValues?.title}
                labelText='Title'
                additionalStyles='mb-4'
            />
        </form>
    </Modal>
  )
}

export default NewStageModal;