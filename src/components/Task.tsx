import { ITask, setCurrentTask } from '@/store/projects/projects.slice';
import React, { useMemo, useState } from 'react';
import TaskTop from './TaskTop';
import TaskPriority from './TaskPriority';
import { useDispatch } from 'react-redux';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BiLink } from 'react-icons/bi';
import { ExternalLink, TagName } from '@/utils/types';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';
import Tag from './Tag';
import TaskLinks from './TaskLinks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BiCheckCircle } from "react-icons/bi";
import Button from './common/Button';
import useModals from '@/hooks/useModals';
import ImageWithFallback from './common/ImageWithFallback';

type TaskProps = {
  task: ITask;
  idx: number;
  setTasks: (tasks: ITask[]) => void;
  animate?: boolean;
}

const Task = ({
  task,
  idx,
  animate = true
}: TaskProps) => {
    const {
        title,
        taskId,
        dueDate,
        isDone,
        priority,
        description,
        thumbnailSrc,
        subtasks,
        tags,
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

    const toggleAnimation = () => setIsAnimating(!isDone);

    const [linksDropdownActive, setLinksDropdownActive] = useState<boolean>(false);
    const {openTaskModal} = useModals();

    const toggleLinksDropdown = () => {
      setLinksDropdownActive(!linksDropdownActive);
    }

    const handleClick = () => {
      openTaskModal();
      dispatch(setCurrentTask(task as ITask));
      closeOpenTabs();
    }

    const closeOpenTabs = () => {
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
          duration: 2.05,
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

    const externalLinksCount = useMemo(() => task.externalLinks?.length || 0, [task.externalLinks]);

    const taskContent = <>
      {thumbnailSrc && (
        <div className='w-full h-32 flex items-start overflow-clip rounded-bl-lg border border-stone-200'>
          <ImageWithFallback
            src={thumbnailSrc}
            alt=''
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
        {externalLinksCount > 0 && (
          <div className='grow flex items-center gap-1 relative self-end'>
            <ButtonWithIcon
              icon={<BiLink />}
              additionalStyles='bg-slate-50 rounded-bl-lg'
              action={toggleLinksDropdown}
              title={`
                ${externalLinksCount}
                ${externalLinksCount === 1
                  ? 'link'
                  : 'links'
                }
              `}
              withCount
              itemCount={externalLinksCount}
            />

            <TaskLinks
              links={task.externalLinks as ExternalLink[]}
              isOpen={linksDropdownActive}
              setIsOpen={() => setLinksDropdownActive(!linksDropdownActive)}
            />
          </div>
        )}

        {!!subtasks.length && (
          <Button
            type='button'
            action={() => {}}
            additionalStyles='flex items-center rounded-bl-lg bg-slate-50 w-fit border-slate-300 text-slate-400 gap-1'
          >
            <BiCheckCircle />
            <p className='text-slate-400 text-sm font-sans'>{subtasks.filter(s => s.isDone).length}/{subtasks.length}</p>
          </Button>
        )}

        <div className='w-full flex items-center justify-end gap-2 flex-wrap-reverse min-w-'>
          {tags?.map((t: TagName, i: number) =>
            <Tag
              key={i}
              tag={t}
            />
          )}
          {/* {task.isDone && <TaskLabel text='completed' />} */}
          <TaskPriority priority={priority} />
        </div>
      </div>
    </>;

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
          <div className='opacity-0 pointer-events-none'>
            {taskContent}
          </div>
        </div>
      )
    }

  return (
    <AnimatePresence>
      <motion.div
        variants={variants}
        initial={isDragging && variants.initial}
        animate={animate && variants.animate}
        exit={variants.exit}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        style={draggableStyle}
        className={twMerge(`
          p-3
          w-full
          max-w-[400px]
          h-auto
          flex
          flex-col
          gap-3
          border
          border-slate-300
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
      </motion.div>
    </AnimatePresence>
  )
}

export default Task;