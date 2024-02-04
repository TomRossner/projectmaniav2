'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { closeEditTaskModal } from '@/store/app/app.slice';
import { IProject, IStage, ITask, TPriority, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import ModalTitle from './ModalTitle';
import Button from '../common/Button';
import Line from '../common/Line';
import useModals from '@/hooks/useModals';
import { capitalizeFirstLetter, convertToISODate } from '@/utils/utils';
import { DEFAULT_PRIORITY, PRIORITIES } from '@/utils/constants';
import Label from '../common/Label';

const EditTaskModal = (task: ITask) => {
    const dispatch = useAppDispatch();

    const [selectedPriority, setSelectedPriority] = useState<TPriority>(DEFAULT_PRIORITY);

    const {currentProject, currentTask} = useProjects();
    const {editTaskModalOpen} = useModals();

    const DEFAULT_VALUES: ITask = task;

    const [inputValues, setInputValues] = useState<ITask | null>(null);

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

    const closeModal = () => {
        dispatch(closeEditTaskModal());
        setInputValues(DEFAULT_VALUES);
    }

    const handleSave = (updatedValues: ITask): void => {
        
        const updatedTask: ITask = {
            ...task,
            ...updatedValues
        } as ITask;
        
        const updatedStages: IStage[] = currentProject?.stages.map((stage: IStage) => {
            if (stage.stageId === task.currentStage?.stageId) {

                const updatedTasks: ITask[] = stage.tasks.map(
                    (t: ITask) => {
                        if (t.taskId === task.taskId) {
                            return updatedTask;
                        } else return t;
                    }
                );

                return {
                    ...stage,
                    tasks: updatedTasks
                };
            } else return stage;
        }) as IStage[];

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        closeModal();
    }

    useEffect(() => {
        if (!currentProject) redirect(LINKS['PROJECTS']);
    }, [currentProject])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
        setSelectedPriority(currentTask?.priority as TPriority);
    }, [currentTask])

    useEffect(()=> {
        setInputValues({...inputValues, priority: selectedPriority as string} as ITask);
    }, [selectedPriority])

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedValues = {...inputValues, [ev.target.name]: ev.target.value};
        setInputValues(updatedValues as ITask);
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

    const handleRemoveThumbnail = ()=> {
        setInputValues({...inputValues, imgSrc: ''} as ITask);
    }

  return (
    <>
    {editTaskModalOpen && currentTask && inputValues && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div id='editModal' className='min-w-[400px] max-w-[500px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col drop-shadow-md'>
            <ModalTitle text={`Edit ${currentTask?.title}`}/>
            
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
            <Input
                labelText='Due date'
                type="date"
                name="dueDate"
                id="dueDate"
                value={convertToISODate(inputValues.dueDate as string)}
                onChange={handleInputChange}
                additionalStyles='focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4'
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

            <Label htmlFor="description" labelText='Description' additionalStyles='text-xl block w-full'/>
            <textarea value={inputValues.description} name="description" id="description"  className='text-lg px-1 outline-none mb-4 border rounded-bl-lg border-stone-300 w-full min-h-20 max-h-40' onChange={handleInputChange}/>

            <div className='flex w-full items-center justify-between'>
                <Input type='file' additionalStyles='hidden' labelText='Thumbnail' name='thumbnail' onChange={handleUploadChange} id='thumbnail'/>
                {inputValues.imgSrc
                    ? <button type='button' className='text-xl cursor-pointer text-stone-800' onClick={handleRemoveThumbnail}>Remove</button>
                    :   <Input
                            type='file'
                            id='thumbnail'
                            labelText='Choose thumbnail'
                            name='thumbnail'
                            onChange={handleUploadChange} additionalStyles='hidden'
                            labelAdditionalStyles='cursor-pointer text-blue-500'
                        />
                }
            </div>

            {inputValues.imgSrc && <Image src={inputValues.imgSrc as string} width={100} height={60} alt="Thumbnail" className='w-full rounded-bl-lg border border-black'/>}

            <Line additionalStyles='py-1'/>
            
            <div className='flex items-center gap-1 justify-end'>
                <Button text='Save' action={() => handleSave(inputValues as ITask)} additionalStyles='text-white bg-blue-400 rounded-bl-lg hover:bg-blue-500' />
                
                <Button text='Cancel' action={closeModal} additionalStyles='text-stone-700 hover:bg-slate-200' />
            </div>
        </div>
    </div>}
    </>
  )
}

export default EditTaskModal;