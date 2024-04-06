'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteStagePrompt, openEditStageModal, openNewTaskModal } from '@/store/app/app.slice';
import React, { useEffect, useRef, useState } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import { GoSearch } from 'react-icons/go';
import { RiEditLine } from 'react-icons/ri';
import { BiPlus } from 'react-icons/bi';
import StageTitle from './StageTitle';
import { IStage, ITask } from '@/store/projects/projects.slice';
import { HiOutlineTrash } from "react-icons/hi2";
import TaskPriority from './TaskPriority';
import { twMerge } from 'tailwind-merge';

const StageTop = (stage: IStage) => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    const [searchResults, setSearchResults] = useState<ITask[]>([]);

    const [inputVisible, setInputVisible] = useState<boolean>(false);
    
    const dispatch = useAppDispatch();

    const toggleInputVisibility = (): void => {
        setInputVisible(!inputVisible);
    }

    const handleEdit = (): void => {
        dispatch(openEditStageModal());
    }

    const handleAddNewTask = (): void => {
        dispatch(openNewTaskModal());
    }

    const handleDeletePrompt = (): void => {
        dispatch(openDeleteStagePrompt());
    }

    const handleSearchInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchInputValue(ev.target.value);
    }

    // Needs improvement
    const searchTasks = (inputValue: string): void => {
        const value: string = inputValue.trim().toLowerCase();
        const results: ITask[] = stage.tasks.filter(
            (task: ITask) => task.title
                                    .toLowerCase()
                                    .includes(value));

        if (!results && searchResults.length) {
            setSearchResults([]);
            return;
        } else {
            setSearchResults(results);
        }
    }

    const colorMatchedLetters = (text: string): JSX.Element[] => {
        const letters: string[] = text.trim().split("");

        const value: string = searchInputValue.trim().toLowerCase();

        const coloredLetters: JSX.Element[] = letters.map((letter: string, index: number) => {
            return (
                <span
                    key={index}
                    className={twMerge(`
                        text-xl
                        text-stone-800
                        font-medium
                        ${value.includes(letter.toLowerCase()) && 'bg-blue-300'}
                    `)}
                >
                    {letter}
                </span>
            )
        })

        return coloredLetters as JSX.Element[];
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
    <div
        className={`
            flex
            items-center
            gap-2
            px-3
            py-2
            w-full
            justify-between
            bg-white
            border z-10
            border-b-slate-200
            border-t-0
            border-l-0
            border-r-0
        `}
    >
        <div className='flex items-center gap-2 min-w-0'>
            <span
                title={`${stage.tasks.length} total tasks`}
                className={`
                    min-w-6
                    max-w-fit
                    text-center
                    aspect-square
                    px-2
                    pt-1
                    text-lg
                    text-stone-500
                    font-semibold
                    border
                    bg-slate-50
                    cursor-default
                    shrink-0
                `}
            >
                {stage.tasks.length}
            </span>
            <StageTitle title={stage.title as string} />
        </div>

        <div className='flex items-center gap-1 py-1 flex-grow justify-end'>

            <ButtonWithIcon
                title='Add task'
                action={handleAddNewTask}
                icon={<BiPlus />}
            />

            <input
                type="search"
                name="stageSearchInput"
                ref={searchInputRef}
                onBlur={toggleInputVisibility}
                className={twMerge(`
                    transition-all
                    h-7
                    border
                    outline-none
                    border-slate-300
                    text-lg
                    hover:border-slate-600
                    focus:border-slate-600
                    pt-1
                    ${inputVisible
                        ? 'w-auto px-1 inline-block'
                        : 'hidden w-0 px-0'
                    }
                `)}
                onChange={handleSearchInputChange}
                value={searchInputValue}
                placeholder='Search tasks...'
            />

            <ButtonWithIcon
                title='Search'
                action={toggleInputVisibility}
                additionalStylesForState={'hidden'}
                state={inputVisible}
                icon={<GoSearch />}
            />

            <ButtonWithIcon
                title='Edit'
                action={handleEdit}
                icon={<RiEditLine />}
            />

            <ButtonWithIcon
                title='Delete stage'
                action={handleDeletePrompt}
                icon={<HiOutlineTrash />}
                additionalStyles='hover:text-red-500 hover:border-red-500'
            />
            {/* <ButtonWithIcon
                title='Options'
                action={handleStageMenu}
                icon={<BsThreeDotsVertical/>}
            /> */}

        </div>

        {inputVisible &&
            <div className='flex flex-col px-2 py-1 absolute top-14 right-0 z-10 w-5/6 bg-white border border-stone-800 rounded-bl-lg'>
                {searchResults.length
                    && (
                        <p className='text-right w-full px-1'>
                            {searchResults.length} result{searchResults.length === 1 ? '' : 'results'} found
                        </p>
                    )
                }
                <div className='flex flex-col gap-3 py-3'>
                    {searchResults.length
                        ?   searchResults.map(
                                (task: ITask) =>
                                    <div key={task.taskId} className='w-full p-1 flex justify-between border border-blue-500 rounded-bl-lg bg-slate-100'>
                                        <p className='text-xl text-stone-800'>
                                            {colorMatchedLetters(task.title)}
                                        </p>
                                        
                                        <TaskPriority priority={task.priority} />
                                    </div>
                            )
                        :   <p className='text-stone-800 text-lg'>No tasks found</p>
                    }
                </div>
            </div>
        }
    </div>
    </>
  )
}

export default StageTop;