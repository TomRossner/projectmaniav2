import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import Button from './common/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from '@/hooks/hooks';
import { STAGE_MENU } from '@/utils/constants';
import InputLabel from './common/InputLabel';
import Line from './common/Line';
import { getFilters, getStatus, setPriorityColor } from '@/utils/utils';
import { Filter, Priority, StageOptions, Status } from '@/utils/types';
import { IStage, ITask, setFilters } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useFilters from '@/hooks/useFilters';

type FiltersProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    setTasks: (tasks: ITask[]) => void;
    stage: IStage;
}

const Filters = ({isOpen, setIsOpen, setTasks, stage}: FiltersProps) => {
    const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
    const {filters} = useFilters();

    const {currentStage} = useProjects();

    const dispatch = useAppDispatch();

    const closeFilterWindow = () => {
        setIsOpen(false);
    }

    const filtersOption = STAGE_MENU.find(f => f.option.toLowerCase() === "filter");

    const clearAllFilters = () => {
        setSelectedFilters([]);
        setTasks(stage.tasks);
    }

    const handleSelect = (ev: ChangeEvent<HTMLInputElement>, opt: StageOptions) => {
        const {target: {value, type}} = ev;

        if (type === "checkbox" && isSelected(value)) {
            setSelectedFilters(selectedFilters.filter(f => f.value !== value));
            return;
        }

        const updatedFilters: Filter[] = type === "checkbox"
            ? [
                ...selectedFilters.filter(f => f.value !== opt.option),
                {
                    value,
                    category: opt.category as string
                }
            ] : [
                ...selectedFilters.filter(f => f.category !== opt.category),
                {
                    value,
                    category: opt.category as string
                }
            ];

        setSelectedFilters(updatedFilters);
    }

    const isSelected = (opt: string): boolean => {
        return selectedFilters.some(f => f.value === opt);
    }

    const applyFilters = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filters = getFilters(["priority", "tag", "status", "date"], selectedFilters);

        let filteredTasks: ITask[] = currentStage?.tasks as ITask[];

        for (const filter of filters) {
            const category = filter.category.toLowerCase();

            switch (category) {
                case "priority":
                    filteredTasks = filteredTasks.filter(t => t.priority === filter.value.toLowerCase()) as ITask[];
                    break;
                case "tag":
                    filteredTasks = filteredTasks.filter(t => t.tags.some(t => t.toLowerCase() === filter.value.toLowerCase())) as ITask[];
                    break;
                case "status":
                    filteredTasks = filteredTasks.filter(t => t.isDone === getStatus(t.isDone, filter.value as Status)) as ITask[];
                    break;
                
                default:
                    filteredTasks = filteredTasks;
                    break;
            }
        }

        setTasks(filteredTasks);
        closeFilterWindow();
    }
    
    // Update filters
    useEffect(() => {
        dispatch(setFilters(selectedFilters));
    }, [selectedFilters])

    // Reset selectedFilters when filters are cleared from 'Reset filters' button displayed when no tasks match filters. 
    useEffect(() => {
        if (!filters.length && selectedFilters.length > 0) setSelectedFilters([]);
    }, [filters])

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.form
                className={`
                    absolute
                    top-12
                    -z-10
                    w-full
                    bg-stone-50
                    border-b
                    border-slate-300
                    p-2
                    flex
                    flex-col
                    gap-4
                    overflow-y-hidden
                `}
                initial={{
                    translateY: "-100%"
                }}
                animate={{
                    translateY: "0%",
                    transition: {
                        duration: 0.15
                    }
                }}
                exit={{
                    translateY: "-100%",
                    transition: {
                        duration: 0.1
                    }
                }}
                onSubmit={applyFilters}
            >
                <h4 className='text-xl w-full text-start flex items-center justify-between'>
                    <span>Filters</span>
                    <Button
                        type='button'
                        action={clearAllFilters}
                        disabled={!selectedFilters.length}
                        additionalStyles='border-none w-fit font-normal text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
                    >
                        <span>Clear all {!!selectedFilters.length && `(${selectedFilters.length})`}</span>
                    </Button>
                </h4>

                <div className='flex flex-col'>
                    {filtersOption?.subOptions?.map(sub => {
                        return (
                            <div key={sub.option} className='flex items-start gap-2 flex-col'>
                                <h5>{sub.option}</h5>

                                <div className='flex gap-1 items-start flex-wrap'>
                                    {sub.subOptions?.map((o, idx) => {
                                        return (
                                            <Fragment key={o.option}>
                                                <input
                                                    type={sub.option === "Tag" ? "checkbox" : "radio"}
                                                    id={o.option}
                                                    name={sub.option.toLowerCase()}
                                                    onChange={(ev) => handleSelect(ev, o)}
                                                    value={o.option}
                                                    checked={isSelected(o.option)}
                                                    hidden
                                                />

                                                <InputLabel 
                                                    text={o.option.toUpperCase()}
                                                    htmlFor={o.option}
                                                    isSelectable
                                                    additionalStyles={`
                                                        text-md
                                                        min-w-[60px]
                                                        px-3
                                                        flex
                                                        items-center
                                                        justify-center
                                                        pt-0.5
                                                        cursor-pointer
                                                        text-white
                                                        opacity-30
                                                        border
                                                        border-transparent
                                                        transition-colors
                                                        ${(sub.option !== "Tag" && sub.option !== "Priority") && `
                                                            border
                                                            border-slate-300
                                                            bg-slate-100
                                                            sm:hover:bg-slate-200
                                                            active:bg-slate-200
                                                            text-black
                                                        `}
                                                        ${sub.option === "Priority" && setPriorityColor(o.option as Priority)}
                                                        ${idx === 0 && "rounded-bl-lg"}
                                                        ${isSelected(o.option) && "opacity-100 border-blue-500"}
                                                    `}
                                                />
                                            </Fragment>
                                        )
                                    })}
                                </div>

                                <Line />
                            </div>
                        )
                    })}
                </div>

                <div className='grow flex items-center w-full gap-2'>
                    <Button
                        type='submit'
                        additionalStyles='bg-blue-400 text-white rounded-bl-lg w-full'
                    >
                        <span>Save</span>
                    </Button>
                    <Button
                        action={closeFilterWindow}
                        type='button'
                        additionalStyles='w-full'
                    >
                        <span>Close</span>
                    </Button>
                </div>
            </motion.form>
        )}
    </AnimatePresence>
  )
}

export default Filters;