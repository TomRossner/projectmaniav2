import { ITask } from '@/store/projects/projects.slice';
import { DragOverlay } from '@dnd-kit/core';
import React from 'react';
import TaskLinks from '../TaskLinks';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { BiLink } from 'react-icons/bi';
import { ExternalLink, TagName } from '@/utils/types';
import Tag from '../Tag';
import TaskPriority from '../TaskPriority';
import TaskTop from '../TaskTop';
import { twMerge } from 'tailwind-merge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import ImageWithFallback from '../common/ImageWithFallback';

type TaskDragOverlayProps = {
    task: ITask;
}

const TaskDragOverlay = (props: TaskDragOverlayProps) => {
    const {
        task: {
            isDone,
            dueDate,
            priority,
            tags,
            taskId,
            title,
            currentStage,
            description,
            externalLinks,
            thumbnailSrc
        }
    } = props;

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
          task: props.task
        }
    });

    const draggableStyle = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const taskContent = <div
        // {...attributes}
        // {...listeners}
        // ref={setNodeRef}
        // style={draggableStyle}
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
                <ImageWithFallback
                    src={thumbnailSrc}
                    width={100}
                    height={60}
                    alt=''
                    className='opacity-95 aspect-auto w-full h-auto'
                />
            </div>
        )}
          
        <TaskTop
            task={props.task}
            title={title}
            additionalStyles={`${(isDone) && 'text-green-600'}`}
        />

        <p className='line-clamp-3 w-full text-stone-500'>
            {description}
        </p>

        <div className='flex items-center justify-between w-full gap-1'>
            <div className='grow flex items-center gap-1 relative self-end'>
                <ButtonWithIcon
                    icon={<BiLink />}
                    additionalStyles='bg-slate-50 rounded-bl-lg'
                    action={() => {}}
                    title={`
                        ${externalLinks!.length}
                        ${externalLinks!.length === 1
                            ? 'link'
                            : 'links'
                        }
                    `}
                    withCount
                    itemCount={externalLinks!.length}
                />

                <TaskLinks
                    links={externalLinks as ExternalLink[]}
                    isOpen={false}
                    setIsOpen={() => {}}
                />
            </div>

            <div className='w-full flex items-center justify-end gap-2 flex-wrap-reverse min-w-'>
              {tags?.map((t: TagName, i: number) =>
                <Tag key={i} tag={t} />
              )}
              <TaskPriority priority={priority} />
            </div>
        </div>
    </div>;

  return (
    <>
    {createPortal(
        <DragOverlay zIndex={99} className='border border-red-500'>
            {taskContent}
        </DragOverlay>,
        document.body
    )}
    </>
  )
}

export default TaskDragOverlay;