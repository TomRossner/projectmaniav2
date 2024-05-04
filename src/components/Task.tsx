import { IProject, IStage, ITask, setCurrentProject } from '@/store/projects/projects.slice';
import React, { useEffect, useState } from 'react';
import TaskTop from './TaskTop';
import TaskPriority from './TaskPriority';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import useProjects from '@/hooks/useProjects';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BiLink, BiLinkExternal } from 'react-icons/bi';
import { ExternalLink } from '@/utils/interfaces';
import Link from 'next/link';
import { formatURL } from '@/utils/utils';
import TaskLabel from './TaskLabel';
import { TLabel } from '@/utils/types';
import { twMerge } from 'tailwind-merge';

const Task = (task: ITask) => {
    const {
        title,
        taskId,
        dueDate,
        isDone,
        priority,
        currentStage,
        description,
        imgSrc
    } = task;
    
    const [currentTask, setCurrentTask] = useState<ITask | null>(null);

    const {currentProject} = useProjects();

    const dispatch = useDispatch();

    useEffect(() => {
      const updatedStages: IStage[] = currentProject?.stages.map((stage: IStage) => {
        if (stage.stageId === currentStage?.stageId) {
          const updatedTasks: ITask[] = stage.tasks.map((t: ITask) => {
            if (t.taskId === taskId) {
              return {
                ...t,
                isDone: currentTask?.isDone
              } as ITask;
            } else return t;
          });
  
          return {
            ...stage,
            tasks: updatedTasks
          }
        } else return stage;
      }) as IStage[];

      if (currentTask) dispatch(setCurrentProject({
        ...currentProject,
        stages: updatedStages
      } as IProject));
    }, [currentTask])

    useEffect(() => {
      setCurrentTask(task);
    }, [])

    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const toggleAnimation = (): void => setIsAnimating(!isDone);

    const [linksDropdownActive, setLinksDropdownActive] = useState<boolean>(false);

    const toggleLinksDropdown = () => {
      setLinksDropdownActive(!linksDropdownActive);
    }

    const closeOpenTabs = () => {
      linksDropdownActive && toggleLinksDropdown();
    }

  return (
    <div
      onClick={closeOpenTabs}
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
        sm:hover:-translate-y-1
        sm:hover:shadow-md
        sm:hover:opacity-100
        sm:opacity-85
        active:-translate-y-0
        active:shadow-none
        border-slate-300
        ${isDone
          ? 'sm:hover:border-green-500'
          : 'sm:hover:border-blue-500'
        }
        ${isDone && !isAnimating && 'bg-green-200 sm:hover:bg-green-100'}
        ${isAnimating && 'bg-green-200'}
      `)}
    >
        {imgSrc && (
          <div className='w-full h-32 flex items-start overflow-clip rounded-bl-lg border border-stone-200'>
            <Image
              src={imgSrc}
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

        <p className='line-clamp-3 w-full'>
          {description}
        </p>

        <div className='flex items-center justify-between w-full gap-1'>
          {/* <button
            onClick={isDone ? handleIsDone : toggleAnimation}
            onAnimationIteration={handleIsDone}
            className={`
              border
              rounded-bl-lg
              py-1
              px-2
              flex
              items-center
              justify-center
              text-lg
              transition-colors
              duration-100
              ${!isDone && isAnimating && 'animate-ping'}
              ${!isDone
                ? `
                  bg-white
                  sm:hover:bg-green-300
                  sm:hover:text-white
                  active:text-white
                  active:bg-green-300
                  border-green-200
                  text-stone-300
                `
                : `
                  border-slate-300
                  bg-slate-100
                  text-slate-400
                  sm:hover:text-slate-600
                  sm:hover:border-slate-600
                  active:text-slate-600
                  active:border-slate-600
                `
              }
            `}
          >
            <span className={`${!isDone && isAnimating && ''} ${isDone && 'hidden'} text-md`}>
              <MdCheck/>
            </span>
            
            <span className={`${!isDone && 'hidden'} text-md`}>
              <RxCross2/>
            </span>
          </button> */}

          <div className='grow flex items-center gap-1 relative self-end'>
              <ButtonWithIcon
                icon={<BiLink />}
                additionalStyles='bg-slate-50'
                action={toggleLinksDropdown}
                title={`
                  ${currentTask?.externalLinks!.length}
                  ${currentTask?.externalLinks!.length === 1
                    ? 'link'
                    : 'links'
                  }
                `}
              />

              {linksDropdownActive && currentTask?.externalLinks?.length !== 0 && (
                <div
                  onClick={toggleLinksDropdown}
                  className={`
                    w-[220px]
                    sm:w-[270px]
                    absolute
                    bottom-4
                    sm:bottom-2
                    left-[10%]
                    sm:left-[90%]
                    flex
                    flex-col
                    items-start
                    py-1
                    shadow-md
                    border
                    border-slate-300
                    bg-slate-50
                    z-40
                  `}
                >
                  {currentTask?.externalLinks?.map((link: ExternalLink, index: number) => {
                    return (
                        <Link
                          key={index}
                          href={formatURL(link.url) as string}
                          target='_blank'
                          rel='noreferrer noopener'
                          className={`
                            cursor-pointer
                            flex
                            items-center
                            justify-between
                            gap-2
                            px-2
                            w-full
                            text-md
                            text-blue-400
                            sm:hover:text-blue-500
                            sm:hover:bg-slate-100
                            active:text-blue-500
                          `}
                        >
                          <span className='pt-1 w-full truncate'>{formatURL(link.url)}</span>
                          
                          <span className='text-lg' title={`Go to ${formatURL(link.url)}`}>
                            <BiLinkExternal />
                          </span>
                        </Link>
                    )
                  })}
                </div>
                )
              }
          </div>

          <div className='w-full flex items-center justify-end gap-2 flex-wrap-reverse'>
            {task.labels?.map((label: TLabel, i: number) => <TaskLabel key={i} text={label} />)}
            {task.isDone && <TaskLabel text='completed' />}
            <TaskPriority priority={priority} />
          </div>
        </div>
    </div>
  )
}

export default Task;