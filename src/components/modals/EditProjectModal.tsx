'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, setCurrentProject, updateProjectAsync } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Input from '../common/Input';
import useModals from '@/hooks/useModals';
import Modal from './Modal';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { IUser } from '@/store/auth/auth.slice';
import { ActivityType } from '@/utils/types';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';
import { getSocket } from '@/utils/socket';
import { setErrorMsg } from '@/store/error/error.slice';
import { prepend } from '@/utils/utils';

const EditProjectModal = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {currentProject} = useProjects();
    const {isEditProjectModalOpen, closeEditProjectModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user} = useAuth();
    const socket = getSocket();

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const DEFAULT_VALUES = useMemo(() => ({
        ...currentProject
    } as IProject), [currentProject])

    const [inputValues, setInputValues] = useState<IProject | null>(null);

    const closeModal = useCallback(() => {
        closeEditProjectModal();
        setInputValues(DEFAULT_VALUES);
    }, [DEFAULT_VALUES, closeEditProjectModal]);

    const handleSave = useCallback(async (ev: FormEvent<HTMLFormElement>, updatedValues: IProject) => {
        ev.preventDefault();

        try {
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
    
            
            dispatch(setCurrentProject(updatedCurrentProject));
            
            closeModal();
    
            if (currentProject?.title !== updatedValues.title) {
                // Updates currentProject property in stages
                dispatch(updateProjectAsync(updatedCurrentProject));
    
                socket?.emit('updateProject', {
                    ...updatedCurrentProject,
                    lastUpdatedBy: user?.userId as string,
                });
            }
    
            const activityLog = await createNewActivity(
                ActivityType.UpdateProjectTitle,
                user as IUser,
                updatedValues as IProject,
                currentProject?.projectId as string
            );
            
            dispatch(setActivities(prepend(activityLog, activities)));
        } catch (error) {
            console.error(error);
            dispatch(setErrorMsg("Failed updating project"));
        }
    }, [
        activities,
        currentProject,
        closeModal,
        createNewActivity,
        user,
        dispatch,
        socket,
    ]);

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        setInputValues({...inputValues, [name]: value} as IProject);
    }

    // useEffect(() => {
    //     if (!currentProject) router.push(LINKS.PROJECTS);
    // }, [currentProject, router])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
    }, [DEFAULT_VALUES])

    useEffect(() => {
        if (isEditProjectModalOpen && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditProjectModalOpen])

  return (
    <Modal
        title={`Edit ${currentProject?.title}`}
        onSubmit={(ev: FormEvent<HTMLFormElement>) => handleSave(ev, inputValues as IProject)}
        submitBtnType='submit'
        onClose={closeModal}
        isOpen={isEditProjectModalOpen}
        submitBtnText='Save'
    >
        <form onSubmit={(ev) => handleSave(ev, inputValues as IProject)} className='w-full flex flex-col'>
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
        </form>
    </Modal>
  )
}

export default EditProjectModal;