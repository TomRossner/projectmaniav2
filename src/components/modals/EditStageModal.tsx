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
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Line from '../common/Line';

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
    <>
    {editStageModalOpen && currentStage && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <form autoComplete='on' onSubmit={() => handleSave(inputValues as IStage)} className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
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
            {/* <Input
                labelText='Due date'
                type="date"
                name="dueDate"
                id="dueDate"
                value={convertToISODate(inputValues.dueDate)}
                onChange={handleInputChange}
                additionalStyles='focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4'
            /> */}

            {/* <Input
                id='_'
                labelText='Team'
                name=''
                type='text'
                value=''
                additionalStyles='hidden'
                onChange={handleInputChange}
            /> */}
            {/* <div className='mb-3 flex items-center flex-wrap'>
                {inputValues.team?.map((member: ITeamMember) => {
                    const {
                        firstName,
                        lastName,
                        userId,
                        imgSrc
                    } = member;

                    return (
                        <div key={userId} title={`${firstName} ${lastName}`} className='select-none relative overflow-hidden rounded-full w-12 h-12 aspect-square border-2 border-white text-sm font-bold text-center flex items-center justify-center bg-slate-50'>
                            <Image
                                src={imgSrc || defaultProfilePic}
                                alt={`${firstName} ${lastName}`}
                                width={30}
                                height={30}
                                className='aspect-square w-full absolute top-0 left-0 right-0 bottom-0 mx-auto'
                            />

                            {imgSrc
                                ?   null
                                :   <span className='z-10 text-white text-2xl font-medium'>
                                        {firstName[0]}
                                        {lastName[0]}
                                    </span>
                            }
                        </div>
                    )
                })}
            </div> */}
            
            <Line additionalStyles='py-1'/>
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Save' type='submit' additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={closeModal} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>
        </form>
    </div>}
    </>
  )
}

export default EditStageModal;