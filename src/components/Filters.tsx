import React, { ChangeEvent, FormEvent, Fragment, useEffect, useMemo, useState } from 'react';
import Button from './common/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from '@/hooks/hooks';
import { FILTERS_CATEGORIES, STAGE_MENU } from '@/utils/constants';
import InputLabel from './common/InputLabel';
import Line from './common/Line';
import { getStatus, setPriorityColor } from '@/utils/utils';
import { Filter, Priority, StageOptions, Status } from '@/utils/types';
import { IStage, ITask, TeamMember, setFilters } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import useFilters from '@/hooks/useFilters';
import AssigneeCard from './common/AssigneeCard';
import { twMerge } from 'tailwind-merge';

type FiltersProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    setTasks: (tasks: ITask[]) => void;
    stage: IStage;
}

const Filters = ({isOpen, setIsOpen, setTasks, stage}: FiltersProps) => {
    const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
    const {getFilters, getFilteredTasks, filters} = useFilters();
    const {currentProject} = useProjects();

    const {currentStage} = useProjects();

    const [selectedAssignees, setSelectedAssignees] = useState<TeamMember[]>([]);
    const assigneesIds: string[] = useMemo(() => selectedAssignees.map(a => a.userId), [selectedAssignees]);

    const dispatch = useAppDispatch();

    const closeFilterWindow = () => {
        setIsOpen(false);
    }

    const filtersOption = STAGE_MENU.find(f => f.option.toLowerCase() === "filter");

    const clearAllFilters = () => {
        setSelectedFilters([]);
        setSelectedAssignees([]);
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
        // dispatch(setFilters(updatedFilters));
    }

    const isSelected = (opt: string): boolean => {
        return selectedFilters.some(f => f.value === opt);
    }

    const getTasksByAssignees = (tasks: ITask[], filter: Filter): ITask[] => {
        if (filter.category !== FILTERS_CATEGORIES["Assignee"]) return tasks;

        const ids = filter.value.split(", ");

        const filtered: ITask[] = [] 

        for (const task of tasks) {
            const {assignees} = task;
            
            for (const id of ids) {
                if (assignees.some(a => a === id)) {
                    filtered.push(task);
                }
            }
        }

        return filtered;
    }

    const applyFilters = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filters = getFilters(["priority", "tag", "status", "date", "assignee"], selectedFilters);

        // setTasks(getFilteredTasks(stage.tasks, filters));
        dispatch(setFilters(filters)); // New
        closeFilterWindow();
    }

    const handleAssigneeSelect = (assignee: TeamMember) => {
        if (assigneesIds.some(id => id === assignee.userId)) return;

        setSelectedAssignees([
            ...selectedAssignees,
            assignee
        ]);
    }

    const handleAssigneeRemove = (assigneeId: string) => {
        setSelectedAssignees([
            ...selectedAssignees.filter(a => a.userId !== assigneeId)
        ]);
    }
    
    // Update filters
    useEffect(() => {
        console.log(selectedFilters)
        if (!selectedFilters.length) {
            dispatch(setFilters(selectedFilters));
        }
    }, [selectedFilters])

    useEffect(() => {
        console.log(filters)
    }, [filters])

    // Reset selectedFilters when filters are cleared from 'Reset filters' button displayed when no tasks match filters. 
    useEffect(() => {
        if (!filters.length && selectedFilters.length > 0) {
            setSelectedFilters([]);
        }

        if (!filters.length && selectedAssignees.length > 0) {
            setSelectedAssignees([]);
        }
    }, [filters])

    useEffect(() => {
        if (selectedAssignees.length) {
            const assigneesFullNames = selectedAssignees.map(a => a.userId);

            const newAssigneeFilter: Filter = {
                value: assigneesFullNames.join(", "),
                category: 'Assignee',
            }

            const updatedSelectedFilters = [
                ...selectedFilters.filter(f =>
                    f.category !== FILTERS_CATEGORIES["Assignee"]),
                newAssigneeFilter
            ];

            setSelectedFilters(updatedSelectedFilters);
        } else if (!selectedAssignees.length && filters.some((f: Filter) => f.category === FILTERS_CATEGORIES["Assignee"])) {
            setSelectedFilters(selectedFilters => ([
                ...selectedFilters.filter(f => f.category !== FILTERS_CATEGORIES["Assignee"])
            ]));
        }
    }, [selectedAssignees])

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.form
                onSubmit={applyFilters}
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
            >
                <h4 className='text-xl w-full text-start flex items-center justify-between'>
                    <span>Filters</span>
                    <Button
                        type='button'
                        action={clearAllFilters}
                        // disabled={!selectedFilters.length}
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
                                
                                {sub.option === FILTERS_CATEGORIES["Assignee"] && (
                                    <div key={sub.option} className='w-full flex flex-wrap gap-2'>
                                        {currentProject?.team.map(u => {
                                            return (
                                                <AssigneeCard
                                                    key={u.userId}
                                                    assignee={u}
                                                    onClick={() => handleAssigneeSelect(u)}
                                                    withImg={false}
                                                    isSelectable
                                                    onRemove={() => handleAssigneeRemove(u.userId)}
                                                    isSelected={assigneesIds.some(id => id === u.userId)}
                                                />
                                            )
                                        })}
                                    </div>
                                )}

                                <div className='flex gap-1 items-start flex-wrap'>
                                    {sub.subOptions?.map((o, idx) => {
                                        return  (
                                            <Fragment key={o.option}>
                                                <input
                                                    type={sub.option === FILTERS_CATEGORIES["Tag"] ? "checkbox" : "radio"}
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
                                                    additionalStyles={twMerge(`
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
                                                        ${(sub.option !== FILTERS_CATEGORIES["Tag"] && sub.option !== FILTERS_CATEGORIES["Priority"]) && `
                                                            border
                                                            border-slate-300
                                                            bg-slate-100
                                                            sm:hover:bg-slate-200
                                                            active:bg-slate-200
                                                            text-black
                                                        `}
                                                        ${sub.option === FILTERS_CATEGORIES["Priority"] && setPriorityColor(o.option as Priority)}
                                                        ${idx === 0 && "rounded-bl-lg"}
                                                        ${isSelected(o.option) && "opacity-100 border-blue-500"}
                                                    `)}
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
                        disabled={!selectedFilters.length}
                        additionalStyles='bg-blue-400 text-white rounded-bl-lg w-full'
                    >
                        <span>Apply filters {!!selectedFilters.length && `(${selectedFilters.length})`}</span>
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