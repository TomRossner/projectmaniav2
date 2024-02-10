'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useNewTaskModal from '@/hooks/useModals';
import { closeNewTaskModal, setError } from '@/store/app/app.slice';
import React, { useEffect, useState } from 'react';
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Input from '../common/Input';
import Line from '../common/Line';
import { DEFAULT_PRIORITY, DEFAULT_TASK_VALUES, PRIORITIES } from '@/utils/constants';
import { IProject, IStage, ITask, TPriority, setCurrentProject } from '@/store/projects/projects.slice';
import { capitalizeFirstLetter, convertToISODate } from '@/utils/utils';
import Label from '../common/Label';
import useProjects from '@/hooks/useProjects';
import { IBaseTask } from '@/utils/interfaces';
import { createNewTask } from '@/services/projects.api';
import Image from 'next/image';

const NewTaskModal = () => {
    const {newTaskModalOpen} = useNewTaskModal();
    const {currentProject, currentStage} = useProjects();

    const [selectedPriority, setSelectedPriority] = useState<TPriority>(DEFAULT_PRIORITY);

    const [inputValues, setInputValues] = useState<IBaseTask>(DEFAULT_TASK_VALUES);

    const dispatch = useAppDispatch();

    const handleCreate = async (newTaskData: IBaseTask): Promise<void> => {
        if (!currentStage) {
            dispatch(setError('Failed creating task'));
            return;
        }

        const date = new Date(inputValues.dueDate).toJSON();

        const newTask: Partial<ITask> = {
            ...newTaskData,
            dueDate: date,
            currentStage: {
                stageId: currentStage?.stageId,
                title: currentStage?.title
            }
        }

        const {data: task} = await createNewTask(newTask);

        const updatedStages: IStage[] = currentProject?.stages.map((stage: IStage) => {
            if (currentStage.stageId === stage.stageId) {
                return {
                    ...currentStage,
                    tasks: [...currentStage.tasks, task]
                }
            } else return stage;
        }) as IStage[];

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        /*
        -> Update currentProject ✅
        -> currentProject changed ✅
        -> update stages to be currentProject's stages ✅
        -> stages change ✅
        -> update currentStage to be stage that has the same id ✅
        -> currentStage change ✅
        -> update tasks to be currentStage's tasks ✅
        -> tasks updated, should render in UI
        
        */

        handleClose();
    }

    const handleClose = (): void => {
        dispatch(closeNewTaskModal());
        setSelectedPriority(DEFAULT_PRIORITY);
        setInputValues(DEFAULT_TASK_VALUES);
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInputValues({...inputValues, [ev.target.name]: ev.target.value});
    }

    const handleSelectedPriorityChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedPriority(ev.target.value as TPriority);
    }

    const setPriorityColor = (priority: TPriority): string => {
        switch (priority) {
            case 'low':
                return 'rounded-bl-lg hover:bg-green-400';
            case 'medium':
                return 'rounded-0 hover:bg-yellow-400';
            case 'high':
                return 'rounded-0 hover:bg-red-400'
            default:
                return 'rounded-bl-lg hover:bg-slate-200'
        }
    }

    const isSelected = (priority: TPriority): string => {
        switch (priority) {
            case 'low':
                return 'bg-green-400';
            case 'medium':
                return 'bg-yellow-400';
            case 'high':
                return 'bg-red-400';
            default:
                return 'bg-slate-300';

        }
    }

    const handleUploadChange = (e: any) => {
        if (!e.target.files.length) return;
        handleUpload(e.target.files[0]);
    }

    const handleUpload = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64EncodedFile = reader.result as string;
          setInputValues({...inputValues, imgSrc: base64EncodedFile} as ITask);
        }
    }

    const handleRemoveThumbnail = ()=> {
        setInputValues({...inputValues, imgSrc: ''} as ITask);
    }

    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            priority: selectedPriority
        }));
    }, [selectedPriority])
    
  return (
    <>
    {newTaskModalOpen && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-40'>
        <div id='newTaskModal' className='min-w-[350px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col gap-1 drop-shadow-md'>
            <ModalTitle text='Create a task'/>
            
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

                <Label htmlFor="description" labelText='Description' additionalStyles='text-xl block w-full'/>
                <textarea name="description" id="description"  className='text-lg px-1 outline-none mb-4 border rounded-bl-lg border-stone-300 w-full min-h-20 max-h-40' onChange={handleInputChange}/>

                <Input
                    id='dueDate'
                    type='date'
                    name='dueDate'
                    onChange={handleInputChange}
                    value={convertToISODate(inputValues.dueDate)}
                    labelText='Due date'
                    additionalStyles='mb-4'
                />

                <div className='flex gap-1 items-center w-full py-4'>
                    <Label htmlFor="taskPriority" labelText='Priority' additionalStyles='text-xl block w-1/4'/>

                    <div className='w-full flex items-center gap-1'>
                        {PRIORITIES.map((priority: TPriority) => {
                            return (
                                <div key={priority} className='w-full flex items-center justify-center'>
                                    <input
                                        hidden
                                        type="radio"
                                        name='taskPriority'
                                        key={priority}
                                        id={priority}
                                        value={priority}
                                        onChange={handleSelectedPriorityChange}
                                    />

                                    <Label
                                        htmlFor={priority}
                                        labelText={capitalizeFirstLetter(priority)}
                                        title={capitalizeFirstLetter(priority)}
                                        additionalStyles={`
                                            ${priority === selectedPriority ? isSelected(priority) : 'bg-slate-300'}
                                            ${setPriorityColor(priority)}
                                            w-full
                                            border
                                            border-stone-500
                                            py-1
                                            px-2
                                            text-white
                                            text-lg
                                            drop-shadow-md
                                            text-center
                                            transition-colors
                                            cursor-pointer
                                        `}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Thumbnail */}
                <div className='flex w-full items-center justify-between'>
                    <p className='text-stone-800 text-xl'>Thumbnail</p>
                    {
                        inputValues.imgSrc
                            ?   <button type='button' className='text-xl cursor-pointer text-stone-800' onClick={handleRemoveThumbnail}>Remove</button>
                            :   <Input
                                    type='file'
                                    id='imgSrc'
                                    labelText='Choose thumbnail'
                                    name='imgSrc'
                                    onChange={handleUploadChange}
                                    additionalStyles='hidden'
                                    labelAdditionalStyles='cursor-pointer text-blue-500'
                                />
                    }
                </div>
                {
                    inputValues.imgSrc && (
                        <Image
                            src={inputValues.imgSrc}
                            width={100} height={60}
                            alt='Thumbnail'
                            className='w-full border border-black rounded-bl-lg'
                        />
                    )
                }
            </div>
            
            <Line additionalStyles='pb-1'/> 
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Create' action={() => handleCreate(inputValues)} additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={handleClose} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>

            <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
                <span className='font-semibold'>NOTE: </span>
                This task will be added to {currentProject?.title} in {currentStage?.title}
            </p>
        </div>
    </div>}
    </>
  )
}

export default NewTaskModal;