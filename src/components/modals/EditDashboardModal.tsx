'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { closeEditProjectModal } from '@/store/app/app.slice';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import useModals from '@/hooks/useModals';
import Modal from './Modal';

const EditDashboardModal = () => {
    const dispatch = useAppDispatch();

    const {currentProject, currentStage} = useProjects();
    const {editProjectModalOpen} = useModals();

    const DEFAULT_VALUES = {
        ...currentProject
    }

    const [inputValues, setInputValues] = useState<Partial<IProject> | null>(null);

    const closeModal = () => {
        dispatch(closeEditProjectModal());
        setInputValues(DEFAULT_VALUES);
    }

    const handleSave = (updatedValues: IStage): void => {
        if (!updatedValues.title) {
            updatedValues = {
                ...updatedValues,
                title: currentProject?.title as string
            }
        }

        const updatedCurrentProject: IProject = {
            ...currentProject,
            ...updatedValues
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        closeModal();
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        setInputValues({...inputValues, [name]: value});
    }

    useEffect(() => {
        if (!currentProject) redirect(LINKS['PROJECTS']);
    }, [currentProject])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
    }, [])

  return (
    <Modal
        title={`Edit ${currentProject?.title}`}
        onSubmit={() => handleSave(inputValues as IStage)}
        onClose={closeModal}
        isOpen={editProjectModalOpen}
        submitBtnText='Save'
    >
        <Input
            labelText='Title'
            type="text"
            name="title"
            id="title"
            value={inputValues?.title}
            onChange={handleInputChange}
            additionalStyles='focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4'
        />
    </Modal>
  )
}

export default EditDashboardModal;