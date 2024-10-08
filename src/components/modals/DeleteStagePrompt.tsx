'use client'

import React, { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, IStage, setCurrentProject, setCurrentStageIndex } from '@/store/projects/projects.slice';
import Modal from './Modal';
import useModals from '@/hooks/useModals';
import { setErrorMsg } from '@/store/error/error.slice';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { ActivityType } from '@/utils/types';
import useActivityLog from '@/hooks/useActivityLog';
import { IUser } from '@/store/auth/auth.slice';
import useAuth from '@/hooks/useAuth';
import { getSocket } from '@/utils/socket';

const DeleteStagePrompt = () => {
    const {isDeleteStageModalOpen, closeDeleteStageModal} = useModals();
    const {currentStage, stages, currentProject} = useProjects();
    const {createNewActivity, activities} = useActivityLog();
    const {user} = useAuth();
    const socket = getSocket();

    const dispatch = useAppDispatch();

    // Update currentStageIndex
    const updateCurrentStageIndex = useCallback((index: number) => {
        if (index === 0) return dispatch(setCurrentStageIndex(index + 1));
        if (index === stages.length - 1) return dispatch(setCurrentStageIndex(index - 1));
        else return dispatch(setCurrentStageIndex(index - 1));
    }, [stages, dispatch]);

    // Handle stage deletion
    const handleDeleteStage = useCallback(async () => {
        if (!currentStage) {
            dispatch(setErrorMsg('Failed deleting stage'));
            return;
        }

        const currentStageIndex: number = stages.indexOf(currentStage);

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: stages.filter((stage: IStage) =>
                stage.stageId !== currentStage?.stageId
            )
        } as IProject;

        socket?.emit('deleteStage', {
            ...currentStage,
            lastUpdatedBy: user?.userId as string
        });

        updateCurrentStageIndex(currentStageIndex);

        closeDeleteStageModal();

        const activityLog = await createNewActivity(
            ActivityType.DeleteStage,
            user as IUser,
            currentStage as IStage,
            currentProject?.projectId as string
        );

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));
    }, [
        activities,
        currentProject,
        currentStage,
        user,
        dispatch,
        createNewActivity,
        stages,
        closeDeleteStageModal,
        updateCurrentStageIndex,
        socket,
    ]);

  return (
    <Modal
        title={`Delete ${currentStage?.title}`}
        onSubmit={handleDeleteStage}
        onClose={closeDeleteStageModal}
        isOpen={isDeleteStageModalOpen}
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