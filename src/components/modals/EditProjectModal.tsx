'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Input from '../common/Input';
import useModals from '@/hooks/useModals';
import Modal from './Modal';
import { updateProject } from '@/services/projects.api';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { IUser } from '@/store/auth/auth.slice';
import { ActivityType } from '@/utils/types';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';

const EditProjectModal = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {currentProject} = useProjects();
    const {isEditProjectModalOpen, closeEditProjectModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user} = useAuth();

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const DEFAULT_VALUES = {
        ...currentProject
    } as IProject;

    const [inputValues, setInputValues] = useState<IProject | null>(null);

    const closeModal = () => {
        closeEditProjectModal();
        setInputValues(DEFAULT_VALUES);
    }

    const handleSave = async (updatedValues: IProject): Promise<void> => {
        if (!updatedValues.title) {
            updatedValues = {
                ...updatedValues,
                title: currentProject?.title as string,
            }
        }

        const updatedCurrentProject: IProject = {
            ...currentProject,
            ...updatedValues
        } as IProject;

        const activityLog =  await createNewActivity(
            ActivityType.UpdateProjectTitle,
            user as IUser,
            updatedValues as IProject,
            currentProject?.projectId as string
        );

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

        closeModal();

        if (currentProject?.title !== updatedValues.title) {
            // Updates currentProject property in stages
            await updateProject(updatedCurrentProject);
        }
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        setInputValues({...inputValues, [name]: value} as IProject);
    }

    useEffect(() => {
        if (!currentProject) router.push(LINKS.PROJECTS);
    }, [currentProject])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
    }, [])

    useEffect(() => {
        if (isEditProjectModalOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditProjectModalOpen])

  return (
    <Modal
        title={`Edit ${currentProject?.title}`}
        onSubmit={() => handleSave(inputValues as IProject)}
        onClose={closeModal}
        isOpen={isEditProjectModalOpen}
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

export default EditProjectModal;