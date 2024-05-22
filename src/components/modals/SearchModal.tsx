import React, { useEffect, useMemo, useRef, useState } from 'react'
import Modal from './Modal'
import Input from '../common/Input';
import { GoSearch } from 'react-icons/go';
import { twMerge } from 'tailwind-merge';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { RxCross2 } from 'react-icons/rx';
import { ITask } from '@/store/projects/projects.slice';
import TaskPriority from '../TaskPriority';
import { createSearchRegExp } from '@/utils/utils';
import { AnimatePresence, motion } from 'framer-motion';

type SearchModalProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    tasks: ITask[];
}

const SearchModal = (props: SearchModalProps) => {
    const {
        isOpen,
        setIsOpen,
        tasks,
    } = props;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<ITask[]>([]);

    const closeSearchModal = () => {
        setIsOpen(false);
        setSearchQuery("");
    }

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(ev.target.value);
    }

    const colorMatchedLetters = (text: string, query: string): JSX.Element[] | undefined => {
        query = query.trim();

        if (!query.match(/[a-zA-Z]/)) return;
  
        const regex = createSearchRegExp(query);
        const matchingLetters = text.split(regex).map((part, idx) => (
          <span
            key={idx}
            className={twMerge(`
              text-xl
              text-stone-800
              font-medium
              ${part.match(regex) && 'bg-blue-300'}
            `)}
          >
            {part}
          </span>
        ));
  
        return matchingLetters as JSX.Element[];
    }

    const searchTasks = (query: string): void => {
        query = query.trim().toLowerCase();

        if (!query.match(/[a-zA-Z0-9]/)) return;

        const regex = createSearchRegExp(query);
        const results: ITask[] = tasks?.filter(
            (task: ITask) => task.title.match(regex)) as ITask[];

        if (!results && isDirty) {
            setSearchResults([]);
            return;
        } else {
            setSearchResults(results);
        }
    }

    const isDirty: boolean = useMemo(() => !!searchQuery.length, [searchQuery]);

    useEffect(() => {
        if (isOpen) {
            searchInputRef.current?.focus();
        }
    }, [isOpen])

    useEffect(() => {
        if (isDirty) searchTasks(searchQuery);
        else setSearchResults([]);
    }, [searchQuery, isDirty])

  return (
    <Modal
        isOpen={isOpen}
        onClose={closeSearchModal}
        title='Search tasks'
        closeBtnText='Close'
        withSubmitBtn={false}
        withCloseBtn={false}
        withCrossIcon
    >
        <Input
            type="text"
            id='searchInput'
            name="stageSearchInput"
            ref={searchInputRef}
            searchIcon={<GoSearch />}
            // onBlur={toggleInputVisibility}
            additionalStyles={twMerge(`
                transition-all
                h-7
                outline-none
                border-slate-300
                text-lg
                focus:border-slate-300
                border-l
                pl-1
                grow
            `)}
            onChange={handleSearchInputChange}
            value={searchQuery}
            placeholder='Search tasks...'
            iconInsideInput
            inputIcon={
                <ButtonWithIcon
                    withTooltip={false}
                    icon={<RxCross2 />}
                    action={() => setSearchQuery("")}
                    additionalStyles="border-none h-full"
                />
            }
        />

        <AnimatePresence>
            {isOpen &&
                <motion.div
                    className='flex flex-col w-full'
                    initial={{
                        opacity: 0, 
                    }}
                    animate={{
                        opacity: 100,
                        transition: {
                            duration: 0.05
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.1
                        }
                    }}
                >
                    {isDirty
                        && (
                            <p className='text-right w-full px-2 py-1'>
                                {searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
                            </p>
                        )
                    }
                    <div className='flex flex-col gap-3 py-3 overflow-y-auto p-2 max-h-[20vh]'>
                        {isDirty
                            ?   searchResults.map(
                                    (task: ITask) =>
                                        <div
                                            key={task.taskId}
                                            onClick={closeSearchModal}
                                            className='w-full p-1 flex justify-between border border-blue-500 rounded-bl-lg bg-slate-100 cursor-pointer'
                                        >
                                            <p className='text-xl text-stone-800'>
                                                {colorMatchedLetters(task.title, searchQuery)}
                                            </p>
                                            
                                            <TaskPriority priority={task.priority} />
                                        </div>
                                )
                            :   <p className='text-stone-800 text-lg'>No tasks found</p>
                        }
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    </Modal>
  )
}

export default SearchModal;