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
import { IStage, ITask } from '@/store/projects/projects.slice';
import { HiOutlineTrash } from "react-icons/hi2";
import TaskPriority from './TaskPriority';
import TaskTitle from './TaskTitle';

const StageTop = (stage: IStage) => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    const [searchResults, setSearchResults] = useState<ITask[]>([]);

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

    const handleDeletePrompt = () => {
        dispatch(openDeleteStagePrompt());
    }

    const handleSearchInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(ev.target.value);
    }

    const searchTasks = (inputValue: string): void => {
        const value = inputValue.trim().toLowerCase();
        const results: ITask[] = stage.tasks.filter((task: ITask) => task.title.toLowerCase().includes(value));

        if (!results && searchResults.length) {
            setSearchResults([]);
            return;
        } else {
            setSearchResults(results);
        }
    }

    const colorText = (text: string): any => {
        const letters = text.split("");
        const coloredLetters = letters.map((letter: string, index: number) => {
            if (searchInputValue.trim().toLowerCase().includes(letter.toLowerCase()))
                return <span key={`${index}${letter}`} className='bg-blue-300 text-xl text-stone-800 font-medium'>{letter}</span>
            else return <span key={`${index}${letter}`} className='text-xl text-stone-800 font-medium'>{letter}</span>
        })

        return coloredLetters;
    }

    useEffect(() => {
        if (inputVisible) {
            searchInputRef.current?.focus();
        }
    }, [inputVisible])

    useEffect(() => {
        if (searchInputValue) searchTasks(searchInputValue);
        else setSearchResults([]);
    }, [searchInputValue])

    useEffect(() => {
        if (!inputVisible && searchInputValue) setSearchInputValue("");
    }, [searchInputValue, inputVisible])

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
                onChange={handleSearchInputChange}
                value={searchInputValue}
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

        {inputVisible &&
            <div className='flex flex-col gap-3 px-2 py-3 absolute top-14 right-0 z-10 w-5/6 bg-white border border-stone-800 rounded-bl-lg'>
                {searchResults.length
                    ?   searchResults.map(
                            (task: ITask) =>
                                <div key={task.taskId} className='w-full p-1 flex justify-between border border-blue-500 rounded-bl-lg bg-slate-100'>
                                    <p className='text-xl text-stone-800'>{colorText(task.title)}</p>
                                    <TaskPriority priority={task.priority}/>
                                </div>
                        )
                    :   <p className='text-stone-800 text-lg'>No tasks found</p>
                }
            </div>
        }
    </div>

    <Line/>
    </>
  )
}

export default StageTop;