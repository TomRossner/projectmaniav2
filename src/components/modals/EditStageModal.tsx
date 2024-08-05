'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { redirect, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from '../common/Input';
import Modal from './Modal';
import { updateStage } from '@/services/projects.api';
import useModals from '@/hooks/useModals';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { ActivityType } from '@/utils/types';
import { IUser } from '@/store/auth/auth.slice';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';
import useSocket from '@/hooks/useSocket';

const DEFAULT_VALUES = {
    title: '',
}

const EditStageModal = () => {
    const dispatch = useAppDispatch();

    const {currentProject, currentStage, stages} = useProjects();
    const {isEditStageModalOpen, closeEditStageModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user, userId} = useAuth();
    const {emitEvent} = useSocket(userId as string);

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const [inputValues, setInputValues] = useState(DEFAULT_VALUES);

    const router = useRouter();

    const closeModal = useCallback(() => {
        closeEditStageModal();
        setInputValues(DEFAULT_VALUES);
    }, [closeEditStageModal]);

    const handleSave = useCallback(async (updatedValues: IStage) => {
        const updatedStage: IStage = {
            ...currentStage,
            ...updatedValues,
            lastUpdatedBy: user?.userId as string,
        } as IStage;

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: stages.map(s =>
                s.stageId === updatedStage.stageId
                    ? updatedStage
                    : s
            ),
        } as IProject;

        const activityLog =  await createNewActivity(
            ActivityType.UpdateStageTitle,
            user as IUser,
            currentStage as IStage,
            currentProject?.projectId as string
        );
        
        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

        closeModal();

        // if (currentStage?.title !== updatedValues.title) {
        //     // Updates currentStage property in tasks
        // }
        await updateStage(updatedStage);

        emitEvent('updateStage', updatedStage);
    }, [
        activities,
        closeModal,
        currentProject,
        currentStage,
        stages,
        user,
        createNewActivity,
        emitEvent,
        dispatch
    ]);

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;

        setInputValues({
            ...inputValues,
            [name]: value
        });
    }

    useEffect(() => {
        if (isEditStageModalOpen && currentStage) {
            setInputValues(inputValues => ({
                ...inputValues,
                title: currentStage.title
            }));
        }
    }, [isEditStageModalOpen, currentStage])

    useEffect(() => {
        if (!currentProject) router.push(LINKS['PROJECTS']);
    }, [currentProject, router])

    useEffect(() => {
        if (isEditStageModalOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditStageModalOpen])

  return (
    <Modal
        title={`Edit ${currentStage?.title}`}
        onSubmit={() => handleSave(inputValues as IStage)}
        onClose={closeModal}
        isOpen={isEditStageModalOpen}
        submitBtnText='Save'
    >
        <Input
            labelText='Title'
            type="text"
            name="title"
            id="title"
            ref={titleInputRef}
            value={inputValues?.title}
            onChange={handleInputChange}
            additionalStyles='focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4'
        />
    </Modal>
  )
}

export default EditStageModal;