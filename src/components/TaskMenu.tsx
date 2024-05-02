'use client'

import { TASK_MENU_OPTIONS } from '@/utils/constants';
import React, { RefObject, useRef } from 'react';
import TaskMenuOption from './TaskMenuOption';
import { useAppDispatch } from '@/hooks/hooks';
import { closeEditTaskModal, openBackLayer, openDeleteTaskPrompt, openEditTaskModal } from '@/store/app/app.slice';
import { IProject, IStage, ITask, setCurrentProject } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import { motion, AnimatePresence } from 'framer-motion';
import useOnClickOutside from '@/hooks/useOnClickOutside';

interface ITaskMenuProps {
    setIsMenuOpen: (bool: boolean) => void;
    menuOpen: boolean;
    closeOnClickOutside?: boolean;
    toggleMenu: () => void;
}

const TaskMenu = (props: ITaskMenuProps) => {
    const {
        setIsMenuOpen,
        menuOpen,
        toggleMenu,
    } = props;
    
    
    const menuRef = useRef(null);

    useOnClickOutside([menuRef], (toggleMenu));

    const dispatch = useAppDispatch();
    const {currentTask, currentStage, currentProject} = useProjects();
    
    const openEditModal = () => {
        dispatch(openBackLayer());
        dispatch(openEditTaskModal());
    }

    const closeEditModal = () => {
        dispatch(closeEditTaskModal());
    }

    const handleDelete = () => {
        dispatch(openDeleteTaskPrompt());
    }

    const handleIsDone = (task: ITask): void => {
        const {taskId} = task;

        const updatedTasks: ITask[] = currentStage?.tasks.map(t => {
            if (t.taskId === taskId) {
                return {
                    ...task,
                    isDone: !t.isDone
                }
            } else return t;
        }) as ITask[];

        const updatedStage: IStage = {
            ...currentStage,
            tasks: updatedTasks
        } as IStage;

        const updatedStages: IStage[] = currentProject?.stages.map(s => {
            if (s.stageId === currentStage?.stageId) {
                return updatedStage
            } else return s;
        }) as IStage[];

        const updatedProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedProject));
    }
    
    const handleOptionClick = (opt: string): void => {
        setIsMenuOpen(false);

        switch (opt.toLowerCase()) {
            case 'done':
                return handleIsDone(currentTask as ITask);
            case 'reset':
                return handleIsDone(currentTask as ITask);
            case 'edit':
                return openEditModal();
            case 'delete':
                return handleDelete();
            default:
                return closeEditModal();
        }
    }
    
  return (
    
    <AnimatePresence>
        {menuOpen && (
            <motion.div
                initial={{
                    scale: 0.7,
                    opacity: 0,
                    position: "absolute",
                    right: "5%",
                    zIndex: 20,
                    marginBlock: "auto"
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
                <ul
                    ref={menuRef as RefObject<HTMLUListElement>}
                    className='w-[100px] absolute top-[50%] right-[5%] bg-white border border-slate-300 rounded-bl-lg flex flex-col p-1 shadow-md'
                >
                    {TASK_MENU_OPTIONS.map((option: string) => 
                        <TaskMenuOption
                            key={option}
                            action={() => handleOptionClick(option)}
                            option={option.toLowerCase() === 'done' && currentTask?.isDone
                                ? 'Reset'
                                : option   
                            }
                        />
                    )}
                </ul>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default TaskMenu;