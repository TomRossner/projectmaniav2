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

type TaskProps = {
  task: ITask;
  idx: number;
  setTasks: (tasks: ITask[]) => void;
}

const Task = ({task, idx, setTasks}: TaskProps) => {
    const {
        title,
        taskId,
        dueDate,
        isDone,
        priority,
        description,
        thumbnailSrc
    } = task;

    const dispatch = useDispatch();

    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const toggleAnimation = (): void => setIsAnimating(!isDone);

    const [linksDropdownActive, setLinksDropdownActive] = useState<boolean>(false);

    const toggleLinksDropdown = () => {
      setLinksDropdownActive(!linksDropdownActive);
    }

    const handleClick = () => {
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

  return (
      <AnimatePresence>
        <motion.div
          onClick={handleClick}
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 100,
            transition: {
              delay: setDelay(idx),
              duration: 0.3,
              ease: "easeOut"
            }
          }}
          // exit={{
          //   scale: 0.5,
          //   opacity: 0,
          //   transition: {
          //     duration: 0.5
          //   }
          // }}
          className={twMerge(`
            w-full
            max-w-[400px]
            h-auto
            flex
            flex-col
            p-3
            gap-3
            rounded-bl-lg
            border
            cursor-pointer
            transition-all
            relative
            sm:hover:-translate-y-1
            sm:hover:shadow-md
            sm:hover:opacity-100
            sm:opacity-85
            active:-translate-y-0
            active:shadow-none
            border-slate-300
            bg-white
            ${isDone
              ? 'sm:hover:border-green-500'
              : 'sm:hover:border-blue-500'
            }
            ${isDone && !isAnimating && 'bg-green-200 sm:hover:bg-green-100'}
            ${isAnimating && 'bg-green-200'}
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
      </AnimatePresence>
  )
}

export default Task;