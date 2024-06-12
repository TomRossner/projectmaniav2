import { ITask, setCurrentTask } from '@/store/projects/projects.slice';
import React, { useEffect, useRef, useState } from 'react';
import TaskTop from './TaskTop';
import TaskPriority from './TaskPriority';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BiLink } from 'react-icons/bi';
import { ExternalLink, TagName } from '@/utils/types';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';
import Tag from './Tag';
import TaskLinks from './TaskLinks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TaskProps = {
  task: ITask;
  idx: number;
  setTasks: (tasks: ITask[]) => void;
  animate?: boolean
}

const Task = ({task, idx, setTasks, animate = true}: TaskProps) => {
    const {
        title,
        taskId,
        dueDate,
        isDone,
        priority,
        description,
        thumbnailSrc
    } = task;

    const {
      attributes,
      isDragging,
      listeners,
      transform,
      transition,
      setNodeRef,
    } = useSortable({
      id: taskId,
      data: {
        type: "task",
        task
      }
    });

    const dispatch = useDispatch();

    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const toggleAnimation = (): void => setIsAnimating(!isDone);

    const [linksDropdownActive, setLinksDropdownActive] = useState<boolean>(false);

    const toggleLinksDropdown = (): void => {
      setLinksDropdownActive(!linksDropdownActive);
    }

    const handleClick = (): void => {
      dispatch(setCurrentTask(task as ITask));
      closeOpenTabs();
    }

    const closeOpenTabs = (): void => {
      linksDropdownActive && toggleLinksDropdown();
    }

    const setDelay = (idx: number): number => {
      const delay = Number(`0.${idx}`);
      return delay;
    }

    const draggableStyle = {
      transition,
      transform: CSS.Transform.toString(transform)
    }

    const variants = {
      initial: animate
        ? {
          scale: 0.1,
          opacity: 0,
        } : {
          scale: 1,
          opacity: 1
        },
      animate: {
        scale: 1,
        opacity: 100,
        transition: {
          delay: setDelay(idx),
          duration: 0.05,
          ease: "easeIn"
        }
      },
      exit: {
        scale: 0.8,
        opacity: 0,
        transition: {
          duration: 0.1
        }
      }
    }

    const taskContent = <AnimatePresence>
      <motion.div
        onClick={handleClick}
        variants={variants}
        initial={variants.initial}
        animate={animate && variants.animate}
        className={twMerge(`
          w-full
          max-w-[400px]
          h-auto
          flex
          flex-col
          p-3
          gap-3
          cursor-pointer
          transition-all
          relative
          rounded-bl-lg
          sm:hover:-translate-y-1
          sm:hover:shadow-md
          sm:hover:opacity-100
          sm:opacity-85
          active:-translate-y-0
          active:shadow-none
          bg-slate-100
          ${isDone
            ? 'sm:hover:border-green-500 bg-green-200 sm:hover:bg-green-100'
            : 'sm:hover:border-blue-500'
          }
        `)}
      >
          {thumbnailSrc && (
            <div className='w-full h-32 flex items-start overflow-clip rounded-bl-lg border border-stone-200'>
              <Image
                src={thumbnailSrc}
                width={100}
                height={60}
                alt='Thumbnail'
                className='opacity-95 aspect-auto w-full h-auto'
              />
            </div>
          )}
          
          <TaskTop
            task={task}
            title={title}
            additionalStyles={`${(isDone || isAnimating) && 'text-green-600'}`}
          />

          <p className='line-clamp-3 w-full text-stone-500'>
            {description}
          </p>

          <div className='flex items-center justify-between w-full gap-1'>
            <div className='grow flex items-center gap-1 relative self-end'>
                <ButtonWithIcon
                  icon={<BiLink />}
                  additionalStyles='bg-slate-50 rounded-bl-lg'
                  action={toggleLinksDropdown}
                  title={`
                    ${task?.externalLinks!.length}
                    ${task?.externalLinks!.length === 1
                      ? 'link'
                      : 'links'
                    }
                  `}
                  withCount
                  itemCount={task?.externalLinks!.length}
                />

                <TaskLinks
                  links={task.externalLinks as ExternalLink[]}
                  isOpen={linksDropdownActive}
                  setIsOpen={() => setLinksDropdownActive(!linksDropdownActive)}
                />
            </div>

            <div className='w-full flex items-center justify-end gap-2 flex-wrap-reverse min-w-'>
              {task.tags?.map((t: TagName, i: number) =>
                <Tag
                  key={i}
                  tag={t}
                />
              )}
              {/* {task.isDone && <TaskLabel text='completed' />} */}
              <TaskPriority priority={priority} />
            </div>
          </div>
      </motion.div>
    </AnimatePresence>;

    if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={draggableStyle}
          className={twMerge(`
            w-full
            max-w-[400px]
            h-auto
            rounded-bl-lg
            border-2
            border-dashed
            opacity-40
            bg-slate-100
            border-slate-300
            ${isDone
              ? 'sm:hover:border-green-500 border-green-300 border-dashed bg-green-200 sm:hover:bg-green-100'
              : 'sm:hover:border-blue-500'
            }
          `)}
        >
          <span className='opacity-0'>
            {taskContent}
          </span>
        </div>
      )
    }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={draggableStyle}
      className={twMerge(`
        w-full
        max-w-[400px]
        h-auto
        flex
        flex-col
        gap-3
        border
        border-slate-300
        cursor-pointer
        transition-all
        relative
        rounded-bl-lg
        sm:hover:-translate-y-1
        sm:hover:shadow-md
        sm:hover:opacity-100
        sm:opacity-85
        active:-translate-y-0
        active:shadow-none
        bg-slate-100
        ${isDone
          ? 'sm:hover:border-green-500 bg-green-200 sm:hover:bg-green-100'
          : 'sm:hover:border-blue-500'
        }
      `)}
    >
      {taskContent}
    </div>
  )
}

export default Task;