'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { closeEditProjectModal } from '@/store/app/app.slice';
import { IProject, IStage, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Line from '../common/Line';
import useModals from '@/hooks/useModals';

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
    <>
    {editProjectModalOpen && currentProject && inputValues && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div id='editModal' className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
            <ModalTitle text={`Edit ${currentStage?.title}`}/>
            
            <Line additionalStyles='pb-3'/>
            
            <Input
                labelText='Title'
                type="text"
                name="title"
                id="title"
                value={inputValues.title}
                onChange={handleInputChange}
                additionalStyles='focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4'
            />
            
            <Line additionalStyles='py-1'/>
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Save' action={() => handleSave(inputValues as IStage)} additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={closeModal} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>
        </div>
    </div>}
    </>
  )
}

export default EditDashboardModal;