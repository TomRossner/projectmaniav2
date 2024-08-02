'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_STAGE } from '@/utils/constants';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useStage from '@/hooks/useModals';
import { createStage } from '@/services/projects.api';
import Modal from './Modal';
import { setErrorMsg } from '@/store/error/error.slice';
import { ActivityType, NewStageData } from '@/utils/types';
import useAuth from '@/hooks/useAuth';
import useActivityLog from '@/hooks/useActivityLog';
import { IUser } from '@/store/auth/auth.slice';
import { setActivities } from '@/store/activity_log/activity_log.slice';

const NewStageModal = () => {
    const {isNewStageModalOpen, closeNewStageModal} = useStage();
    const {currentProject, stages} = useProjects();
    const {user} = useAuth();
    const {createNewActivity, activities} = useActivityLog();

    const [inputValues, setInputValues] = useState<NewStageData | null>(null);

    const dispatch = useAppDispatch();

    const handleCreate = async (newStageData: NewStageData): Promise<void> => {
        if (!currentProject) {
            dispatch(setErrorMsg('Failed creating stage'));
            return;
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

        handleClose();
    }

    const handleClose = () => {
        closeNewStageModal();
        setInputValues({
            ...DEFAULT_STAGE,
            parentProjectId: currentProject?.projectId as string,
            createdBy: user?.userId as string,
        });
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        
        setInputValues({
            ...inputValues,
            [name]: value,
        } as NewStageData);
    }

    useEffect(() => {
        if (user && currentProject) {
            setInputValues({...DEFAULT_STAGE,
                createdBy: user?.userId,
                parentProjectId: currentProject.projectId
            });
        }
    }, [])
    
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