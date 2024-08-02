'use client'

import React from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, setCurrentProject, setProjects } from '@/store/projects/projects.slice';
import { deleteProject } from '@/services/projects.api';
import Modal from './Modal';
import useModals from '@/hooks/useModals';
import { setErrorMsg } from '@/store/error/error.slice';
import { ActivityType } from '@/utils/types';
import { IUser } from '@/store/auth/auth.slice';
import useActivityLog from '@/hooks/useActivityLog';
import useAuth from '@/hooks/useAuth';
import { setActivities } from '@/store/activity_log/activity_log.slice';

const DeleteProjectPrompt = () => {
    const {isDeleteProjectModalOpen, closeDeleteProjectModal} = useModals();
    const {currentProject, projects} = useProjects();
    const {createNewActivity, activities} = useActivityLog();
    const {user} = useAuth();

    const dispatch = useAppDispatch();

    // Handle project deletion
    const handleDeleteProject = async (): Promise<void> => {
        try {
            if (!currentProject) {
                dispatch(setErrorMsg('Failed deleting project'));
                return;
            }
            
            const activityLog =  await createNewActivity(
                ActivityType.DeleteProject,
                user as IUser,
                currentProject as IProject,
                currentProject?.projectId as string
            );

            dispatch(setActivities([
                ...activities,
                activityLog
            ]));

            await deleteProject(currentProject.projectId);
            
            dispatch(setProjects([
                ...projects.filter((project: IProject) =>
                    project.projectId !== currentProject?.projectId
                )
            ]));

            dispatch(setCurrentProject(null));
            closeDeleteProjectModal();  
    
        } catch (error: any) {
            console.error(error);

            if (error.response) {
                dispatch(setErrorMsg(error.response.data.error));
                return;
            } else dispatch(setErrorMsg('Failed deleting project'));
        }
    }

  return (
    <Modal
        title={`Delete ${currentProject?.title}`}
        onSubmit={handleDeleteProject}
        onClose={closeDeleteProjectModal}
        submitBtnText='Yes, delete'
        isOpen={isDeleteProjectModalOpen}
        optionalNote={`You are deleting ${currentProject?.title} and all of its contents.`}
        submitBtnStyles='rounded-bl-lg bg-red-400 hover:bg-red-500 text-white'
        closeBtnStyles='hover:bg-slate-200'
        noteBelowContent
    >
        <p className='text-center text-stone-600 text-xl font-semibold'>Are you sure?</p>
        <p className='text-center text-red-500 pb-4'>*This action is irreversible*</p>
    </Modal>
  )
}

export default DeleteProjectPrompt;