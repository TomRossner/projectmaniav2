'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { closeNewStageModal, setError } from '@/store/app/app.slice';
import React, { useState } from 'react';
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Input from '../common/Input';
import Line from '../common/Line';
import { DEFAULT_STAGE } from '@/utils/constants';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useStage from '@/hooks/useModals';
import { createStage } from '@/services/projects.api';

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
    <>
    {newStageModalOpen && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-40'>
        <div id='newStageModal' className='min-w-[350px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col gap-1 drop-shadow-md'>
            <ModalTitle text='Create a stage'/>
            
            <Line additionalStyles='pb-2'/>
            
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
            
            <Line additionalStyles='pb-1'/> 
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Create' action={() => handleCreate(inputValues)} additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={handleClose} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>

            <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
                <span className='font-semibold'>NOTE: </span>
                This stage will be added to
                <span className=''> {currentProject?.title}</span>
            </p>
        </div>
    </div>}
    </>
  )
}

export default NewStageModal;