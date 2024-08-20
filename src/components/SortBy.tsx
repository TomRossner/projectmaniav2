import React, { FormEvent, Fragment, useState } from 'react';
import Button from './common/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { IStage, ITask, TeamMember } from '@/store/projects/projects.slice';
import { capitalizeFirstLetter } from '@/utils/utils';
import Input from './common/Input';
import InputLabel from './common/InputLabel';
import { twMerge } from 'tailwind-merge';
import _ from "lodash";
import { GrAscend, GrDescend } from "react-icons/gr";
import ButtonWithIcon from './common/ButtonWithIcon';
import { RxCross2 } from 'react-icons/rx';
import { PRIORITY_ORDER } from '@/utils/constants';
import { SortOption, SortOptionType, SortOrder } from '@/utils/types';
import useFilters from '@/hooks/useFilters';

type SortByProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    stage: IStage;
    setTasks: (tasks: ITask[]) => void;
}

const DEFAULT_SORTING_ORDER: SortOrder = 'ascending';

const SORT_OPTIONS: SortOption[] = [
    // {
    //     type: 'assignee',
    //     order: DEFAULT_SORTING_ORDER,
    //     possibleOrder: ['ascending', 'descending']
    // }, 
    {
        type: 'date',
        order: DEFAULT_SORTING_ORDER,
        possibleOrder: ['ascending', 'descending']
    }, 
    {
        type: 'priority',
        order: DEFAULT_SORTING_ORDER,
        possibleOrder: ['ascending', 'descending']
    }
];

const SortBy = ({isOpen, setIsOpen, setTasks, stage}: SortByProps) => {
    const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
    const {getFilteredTasks, filters} = useFilters()
    const handleSubmit = (ev: FormEvent<HTMLFormElement>, tasks: ITask[]): void => {
        ev.preventDefault();

        applySortOptions(sortOptions, tasks);
        closeSortByWindow();
    }

    const applySortOptions = (options: SortOption[], tasks: ITask[]) => {
        let sortedTasks: ITask[] = tasks;

        for (const option of options) {
            const {order, type} = option;

            // if (type === 'assignee') {
            //     const getAssignees = async (assigneesIds: string[]): Promise<TeamMember[]> => {
            //         for (const id of assigneesIds) {
            //             const {data: assignee} = await getUser(id);
                        
            //             if (assignee) {
            //                 assignees.push(assignee);
            //             }
            //         }

            //         return assignees;
            //     }

            //     sortedTasks = 
            // }

            if (type === 'date') {
                sortedTasks = _.sortBy([...sortedTasks], (t) => t.createdAt)
                
                sortedTasks = order === 'ascending'
                    ? sortedTasks
                    : sortedTasks.toReversed();
            }

            if (type === 'priority') {

                sortedTasks = [...sortedTasks].sort((a, b) =>
                    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

                sortedTasks = order === 'ascending'
                    ? sortedTasks
                    : sortedTasks.toReversed();
            }
        }
        
        setTasks(getFilteredTasks(sortedTasks, filters));
    }

    const closeSortByWindow = () => {
        setIsOpen(!isOpen);
    }

    const handleOptionSelect = (type: string, order: SortOrder = DEFAULT_SORTING_ORDER): void => {
        const newOption: SortOption = {
            type: type as SortOptionType,
            order,
        }

        const isAlreadySelectedWithDifferentOrder: boolean = sortOptions.some(so =>
            so.type === type && so.order !== order);

        // const isAlreadySelected: boolean = sortOptions.some(so =>
        //     so.type === type && so.order === order);

        if (isAlreadySelectedWithDifferentOrder || isSelected(type as SortOptionType, order)) {
            setSortOptions([...sortOptions.map(so =>
                so.type === type
                    ? newOption
                    : so
                )
            ]);
        } else {
            setSortOptions([
                ...sortOptions,
                newOption
            ]);
        }
    }

    const isSelected = (type: SortOptionType, order: SortOrder): boolean => {
        return sortOptions.some(so => (so.type === type) && (so.order === order));
    }

    const removeSortOption = (type: SortOptionType): void => {
        setSortOptions([...sortOptions.filter(o => o.type !== type)]);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.form
                    onSubmit={(ev) => handleSubmit(ev, stage.tasks)}
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
                        <span>Sort by</span>
                        <Button
                            type='button'
                            action={() => setSortOptions([])}
                            disabled={!sortOptions.length}
                            additionalStyles='border-none w-fit font-normal text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
                        >
                            <span>Clear all {!!sortOptions.length && `(${sortOptions.length})`}</span>
                        </Button>
                    </h4>
    
                    <div className='flex flex-col gap-3'>
                        {SORT_OPTIONS.map((sortOption, index) => {
                            return (
                                <div className='flex justify-between flex-wrap items-center w-full' key={index}>
                                    <div className='flex grow gap-4'>
                                        <InputLabel
                                            htmlFor={sortOption.type}
                                            text={capitalizeFirstLetter(sortOption.type)}
                                            additionalStyles='text-md font-medium'
                                        />

                                        <div className='flex gap-1'>
                                            {sortOption.possibleOrder?.map((order, i) => (
                                                <Fragment key={i}>
                                                    <Input
                                                        hidden
                                                        type='radio'
                                                        id={`${sortOption.type} ${order}`}
                                                        name={sortOption.type}
                                                        onChange={() => handleOptionSelect(sortOption.type, order)}
                                                        value={order}
                                                    />
                                                    <InputLabel
                                                        htmlFor={`${sortOption.type} ${order}`}
                                                        isSelectable
                                                        withIcon
                                                        icon={order === 'ascending'
                                                            ? <GrAscend />
                                                            : <GrDescend />
                                                        }
                                                        text={capitalizeFirstLetter(`${order}`)}
                                                        additionalStyles={twMerge(`
                                                            w-fit
                                                            cursor-pointer
                                                            px-2
                                                            py-0.5
                                                            text-sm
                                                            font-light
                                                            rounded-bl-lg
                                                            border
                                                            ${isSelected(sortOption.type, order)
                                                                ? 'border-blue-500 bg-blue-100 text-stone-700'
                                                                : 'border-stone-400 bg-slate-50 text-stone-500'
                                                            }
                                                        `)}
                                                    />
                                                </Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    <ButtonWithIcon
                                        icon={<RxCross2 />}
                                        title='Remove option'
                                        withTooltip={false}
                                        action={() => removeSortOption(sortOption.type)}
                                        disabled={!sortOptions.some(so => so.type === sortOption.type)}
                                    />
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
                            action={closeSortByWindow}
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

export default SortBy;