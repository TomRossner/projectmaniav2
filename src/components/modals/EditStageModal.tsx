'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useEditModal from '@/hooks/useModals';
import useProjects from '@/hooks/useProjects';
import { closeEditStageModal } from '@/store/app/app.slice';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import Modal from './Modal';

const EditStageModal = () => {
    const dispatch = useAppDispatch();

    const {currentProject, currentStage, stages} = useProjects();
    const {editStageModalOpen} = useEditModal();

    const DEFAULT_VALUES = {
        title: '',
    }

    const [inputValues, setInputValues] = useState(DEFAULT_VALUES);

    const closeModal = () => {
        dispatch(closeEditStageModal());
        setInputValues(DEFAULT_VALUES);
    }

    const handleSave = async (updatedValues: IStage) => {
        
        const updatedStage: IStage = {
            ...currentStage,
            ...updatedValues
        } as IStage;

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: stages.map((stage: IStage) => {
                if (stage.stageId === updatedStage.stageId) {
                    return updatedStage;
                } else return stage;
            }
        )} as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        closeModal();
    }

    useEffect(() => {
        if (currentStage) setInputValues(inputValues => ({...inputValues, title: currentStage.title}));
    }, [currentStage])

    useEffect(() => {
        if (!currentProject) redirect(LINKS['PROJECTS']);
    }, [currentProject])

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues({...inputValues, [ev.target.name]: ev.target.value})
    }

  return (
    <Modal
        title={`Edit ${currentStage?.title}`}
        onSubmit={() => handleSave(inputValues as IStage)}
        onClose={closeModal}
        isOpen={editStageModalOpen}
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

export default EditStageModal;