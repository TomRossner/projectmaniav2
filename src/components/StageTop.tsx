'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteStagePrompt, openEditStageModal, openNewTaskModal } from '@/store/app/app.slice';
import React, { useEffect, useRef, useState } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import { GoSearch } from 'react-icons/go';
import { RiEditLine } from 'react-icons/ri';
import { BiPlus } from 'react-icons/bi';
import StageTitle from './StageTitle';
import Line from './common/Line';
import { IStage, setCurrentStage } from '@/store/projects/projects.slice';
import { BsThreeDotsVertical, BsThreeDots } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi2";

const StageTop = (stage: IStage) => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const [inputVisible, setInputVisible] = useState<boolean>(false);
    
    const dispatch = useAppDispatch();

    const toggleInputVisibility = () => {
        setInputVisible(!inputVisible);
    }

    const handleEdit = (): void => {
        // Make sure this stage is the currentStage
        // dispatch(setCurrentStage(stage));
        dispatch(openEditStageModal());
    }

    const handleAddNewTask = (): void => {
        // Make sure this stage is the currentStage
        // dispatch(setCurrentStage(stage));
        dispatch(openNewTaskModal());
    }

    const handleStageMenu = () => {}

    const handleDeletePrompt = () => {
        dispatch(openDeleteStagePrompt());
    }

    useEffect(() => {
        if (inputVisible) searchInputRef.current?.focus();
    }, [inputVisible])

  return (
    <>
    <div className='flex items-center gap-2 px-3 py-2 w-full justify-between'>
        <div className='flex items-center gap-2 min-w-0'>
            <span title={`${stage.tasks.length} total tasks`} className='min-w-6 max-w-fit text-center aspect-square px-2 pt-1 text-lg font-semibold text-stone-500 border bg-slate-50'>
                {stage.tasks.length}
            </span>
            <StageTitle title={stage.title as string}/>
        </div>

        <div className='flex items-center gap-1 py-1 flex-grow justify-end'>

            <ButtonWithIcon
                title='Add task'
                action={handleAddNewTask}
                icon={<BiPlus/>}
            />
            <input
                type="search"
                name="stageSearchInput"
                ref={searchInputRef}
                onBlur={toggleInputVisibility}
                className={`
                    ${inputVisible ? 'w-auto px-1 inline-block' : 'hidden w-0 px-0'}
                    transition-all
                    h-7
                    border
                    outline-none
                    border-slate-300
                    text-lg
                    hover:border-slate-600
                    focus:border-slate-600
                `}
            />

            <ButtonWithIcon
                title='Search'
                action={toggleInputVisibility}
                additionalStylesForState={'hidden'}
                state={inputVisible}
                icon={<GoSearch/>}
            />

            <ButtonWithIcon
                title='Edit'
                action={handleEdit}
                icon={<RiEditLine/>}
            />

            <ButtonWithIcon
                title='Delete stage'
                action={handleDeletePrompt}
                icon={<HiOutlineTrash/>}
                additionalStyles='hover:text-red-500 hover:border-red-500'
            />
            {/* <ButtonWithIcon
                title='Options'
                action={handleStageMenu}
                icon={<BsThreeDotsVertical/>}
            /> */}

        </div>
    </div>

    <Line/>
    </>
  )
}

export default StageTop;