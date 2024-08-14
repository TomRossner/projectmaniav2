'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { useCallback, useEffect, useState } from 'react';
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

    const handleCreate = useCallback(async (newStageData: NewStageData): Promise<void> => {
        if (!currentProject) {
            dispatch(setErrorMsg('Failed creating stage'));
            return;
        }

        newStageData = {
            ...newStageData, 
            lastUpdatedBy: user?.userId as string,
        }

        const {data: newStage} = await createStage(newStageData);

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: [...stages, newStage as IStage],
        } as IProject;

        const activityLog =  await createNewActivity(
            ActivityType.AddStage,
            user as IUser,
            currentProject as IProject,
            currentProject?.projectId as string
        );

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

        socket?.emit('newStage', newStage);

        handleClose();
    }, [
        activities,
        currentProject,
        user,
        createNewActivity,
        dispatch,
        stages,
        handleClose,
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
        onSubmit={() => handleCreate(inputValues as NewStageData)}
        onClose={handleClose}
        submitBtnText='Create'
        optionalNote={`This stage will be added to ${currentProject?.title}`}
        isOpen={isNewStageModalOpen}
    >
        <div className='flex flex-col h-full w-full'>
            <Input
                id='title'
                type='text'
                name='title'
                onChange={handleInputChange}
                value={inputValues?.title}
                labelText='Title'
                additionalStyles='mb-4'
            />
        </div>
    </Modal>
  )
}

export default NewStageModal;