'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { closeNewStageModal, setError } from '@/store/app/app.slice';
import React, { useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_STAGE } from '@/utils/constants';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useStage from '@/hooks/useModals';
import { createStage } from '@/services/projects.api';
import Modal from './Modal';

const NewStageModal = () => {
    const {newStageModalOpen} = useStage();
    const {currentProject, stages} = useProjects();

    const [inputValues, setInputValues] = useState<IStage>(DEFAULT_STAGE);

    const dispatch = useAppDispatch();

    const handleCreate = async (newStageData: IStage): Promise<void> => {
        if (!currentProject) {
            dispatch(setError('Failed creating stage'));
            return;
        }

        const {data: newStage} = await createStage(currentProject.projectId, newStageData);

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: [...stages, newStage as IStage]
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        handleClose();
    }

    const handleClose = (): void => {
        dispatch(closeNewStageModal());
        setInputValues(DEFAULT_STAGE);
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValues({...inputValues, [ev.target.name]: ev.target.value});
    }
    
  return (
    <Modal
        title='Create a stage'
        onSubmit={() => handleCreate(inputValues)}
        onClose={handleClose}
        submitBtnText='Create'
        optionalNote={`This stage will be added to ${currentProject?.title}`}
        isOpen={newStageModalOpen}
    >
        <div className='flex flex-col h-full w-full'>
            <Input
                id='title'
                type='text'
                name='title'
                onChange={handleInputChange}
                value={inputValues.title}
                labelText='Title'
                additionalStyles='mb-4'
            />
        </div>
    </Modal>
  )
}

export default NewStageModal;