'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteStagePrompt, openEditStageModal, openNewTaskModal } from '@/store/app/app.slice';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import StageTitle from './StageTitle';
import { IStage, ITask } from '@/store/projects/projects.slice';
import TaskPriority from './TaskPriority';
import { twMerge } from 'tailwind-merge';
import { BsThreeDots } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGE_MENU, STAGE_MENU_OPTIONS } from '@/utils/constants';
import { TOption } from '@/utils/types';
import Filters from './Filters';
import Input from './common/Input';
import { RxCross2 } from 'react-icons/rx';
import MoreOptions from './common/MoreOptions';
import { TbFilterCancel, TbFilterOff, TbFilterPlus, TbFilterX } from "react-icons/tb";
import useFilters from '@/hooks/useFilters';

type StageTopProps = {
    stage: IStage;
    tasks: ITask[];
    setTasks: (tasks: ITask[]) => void;
}

const StageTop = ({stage, tasks, setTasks}: StageTopProps) => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    const [searchResults, setSearchResults] = useState<ITask[]>([]);

    const [inputVisible, setInputVisible] = useState<boolean>(false);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false);

    const [filtersTabOpen, setFiltersTabOpen] = useState<boolean>(false);
    const {filters} = useFilters();
    
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

    const toggleSubMenu = (): void => {
        setSubMenuOpen(!subMenuOpen);
    }

    // Needs improvement
    const searchTasks = (inputValue: string): void => {
        const value: string = inputValue.trim().toLowerCase();
        const results: ITask[] = tasks?.filter(
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const openSortBy = () => {
        setFiltersTabOpen(true);
    }

    const handleOpt = (opt: TOption) => {
        setMenuOpen(false);

        switch (opt.text.toLowerCase()) {
            case "edit":
                return handleEdit();
            case "delete":
                return handleDeletePrompt();
            case "search":
                return setInputVisible(true);
            case "filter":
                return openSortBy();
            default:
                return setMenuOpen(false);
        }
    }

    const stageOptions = useMemo(() => [...STAGE_MENU.map(o => {
        const {option, icon, multiSelect, subOptions} = o;

        return {
            option,
            icon,
            multiSelect,
            subOptions,
            disabled: !tasks?.length
        }
    })], [tasks?.length]);

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
    <div className='w-full flex flex-col z-20 relative shadow-white shadow-xl'>
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
                border
                border-b-slate-200
                border-t-0
                border-l-0
                border-r-0
            `}
        >
            <div className='flex items-center gap-2 min-w-0'>
                <span
                    title={`${tasks?.length} total tasks`}
                    className={`
                        min-w-6
                        max-w-fit
                        h-fit
                        text-center
                        px-2
                        font-sans
                        text-lg
                        text-stone-500
                        font-semibold
                        border
                        bg-slate-50
                        cursor-default
                        shrink-0
                    `}
                >
                    {tasks?.length}
                </span>
                <StageTitle title={stage?.title as string} />
            </div>

            <div className='flex items-center gap-1 py-1 flex-grow justify-end'>

                <ButtonWithIcon
                    title='Add task'
                    action={handleAddNewTask}
                    icon={<BiPlus />}
                />
                {filtersTabOpen
                    ? (
                        <ButtonWithIcon
                            title='Add filters'
                            action={() => setFiltersTabOpen(!filtersTabOpen)}
                            icon={<TbFilterX />}
                            withCount
                            itemCount={filters.length}
                        />
                    ) : (
                        <ButtonWithIcon
                            title='Clear filters'
                            action={() => setFiltersTabOpen(!filtersTabOpen)}
                            icon={<TbFilterPlus />}
                            withCount
                            itemCount={filters.length}
                        />   
                    )
                }

                {/* <AnimatePresence>
                    {inputVisible && (
                        <motion.div
                            className='flex items-center justify-center overflow-hidden'
                            initial={{
                                width: "0px",
                                opacity: 0, 
                            }}
                            animate={{
                                width: "100%",
                                opacity: 100,
                                transition: {
                                    duration: 0.05
                                }
                            }}
                            exit={{
                                width: "0px",
                                opacity: 0,
                                transition: {
                                    duration: 0.1
                                }
                            }}
                        >
                            <Input
                                type="text"
                                id='searchInput'
                                name="stageSearchInput"
                                ref={searchInputRef}
                                onBlur={toggleInputVisibility}
                                additionalStyles={twMerge(`
                                    transition-all
                                    h-7
                                    border
                                    outline-none
                                    border-none
                                    border-slate-300
                                    text-lg
                                    hover:border-slate-600
                                    focus:border-slate-600
                                `)}
                                onChange={handleSearchInputChange}
                                value={searchInputValue}
                                placeholder='Search tasks...'
                                iconInsideInput
                                inputIcon={!!searchInputValue && (
                                    <ButtonWithIcon
                                        icon={<RxCross2 />}
                                        withTooltip={false}
                                        action={() => setSearchInputValue("")}
                                        additionalStyles="border-none h-full"
                                    />
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence> */}

                {/* <ButtonWithIcon
                    title='Search'
                    action={toggleInputVisibility}
                    additionalStylesForState={'hidden'}
                    state={inputVisible}
                    icon={<GoSearch />}
                /> */}

                {/* <ButtonWithIcon
                    title='Edit'
                    action={handleEdit}
                    icon={<RiEditLine />}
                /> */}

                {/* <ButtonWithIcon
                    title='Delete stage'
                    action={handleDeletePrompt}
                    icon={<HiOutlineTrash />}
                    additionalStyles='hover:text-red-500 hover:border-red-500'
                /> */}

                <ButtonWithIcon
                    title='More options'
                    action={toggleMenu}
                    icon={<BsThreeDots />}
                />

                {/* <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{
                                scale: 0.7,
                                opacity: 0,
                                zIndex: 20,
                                position: "absolute",
                                top: 0,
                                right: 0,
                                marginBlock: "auto",
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    duration: 0.07
                                }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                transition: {
                                    duration: 0.1
                                }
                            }}
                        >
                            <ul className='w-[100px] absolute right-6 top-11 bg-white border border-slate-300 rounded-bl-lg flex flex-col p-1 shadow-md'>
                                {stageOptions.map(opt => {
                                    return (
                                        <Option
                                            key={opt.option}
                                            action={() => handleOpt(opt)}
                                            state={subMenuOpen}
                                            stageOpt={opt}
                                            isDisabled={opt.disabled}
                                            isStageOption
                                        />
                                    )
                                })}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence> */}
                <MoreOptions
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                    options={STAGE_MENU_OPTIONS}
                    action={handleOpt}
                    additionalStyles='top-[80%] right-6'
                />
            </div>

            {/* {inputVisible &&
                <div className='flex flex-col px-2 py-1 absolute top-14 right-0 z-10 w-5/6 bg-white border border-stone-800 rounded-bl-lg'>
                    {!!searchResults.length
                        && (
                            <p className='text-right w-full px-1'>
                                {searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
                            </p>
                        )
                    }
                    <div className='flex flex-col gap-3 py-3'>
                        {!!searchResults.length
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
            } */}
        </div>
        <Filters
            isOpen={filtersTabOpen}
            setIsOpen={setFiltersTabOpen}
            setTasks={setTasks}
            stage={stage}
        />
    </div>
  )
}

export default StageTop;