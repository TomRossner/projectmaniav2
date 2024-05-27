'use client'

import React, { useEffect, useState } from 'react';
import StageTop from './StageTop';
import StageContent from './StageContent';
import { useAppDispatch } from '@/hooks/hooks';
import { IStage, ITask, setCurrentStage } from '@/store/projects/projects.slice';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Stage = (stage: IStage) => {
    const dispatch = useAppDispatch();
    const [tasks, setTasks] = useState<ITask[]>([]);

    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: stage.stageId as string,
      data: {
        type: "stage",
        stage
      }
    });

    const draggableStyle = {
      transition,
      transform: CSS.Transform.toString(transform)
    }

    useEffect(() => {
      setTasks(stage.tasks);
    }, [stage.tasks]);

    if (isDragging) {
      return (
        <div
          {...attributes}
          {...listeners}
          style={draggableStyle}
          ref={setNodeRef}
          className={`
            w-full
            h-full
            items-start
            snap-center
            snap-always
            shrink-0
            flex
            self-start
            max-w-[430px]
            border-dashed
            border-2
            border-l-slate-100
            border-r-slate-100
            flex-col
            min-h-full
            relative
            overflow-hidden
            bg-white
            border-slate-300
          `}
        >
          <span className='opacity-0'>
            <StageTop
              stage={stage}
              tasks={tasks}
              setTasks={setTasks}
            />
            <StageContent
              stage={stage}
              tasks={tasks}
              setTasks={setTasks}
            />
          </span>
        </div>
      )
    }

  return (
      <div
        {...attributes}
        {...listeners}
        style={draggableStyle}
        ref={setNodeRef}
        onClick={() => dispatch(setCurrentStage(stage))}
        className={`
          w-full
          h-full
          items-start
          snap-center
          snap-always
          shrink-0
          flex
          self-start
          max-w-[430px]
          border-l
          border-r
          border-l-slate-100
          border-r-slate-100w-full
          flex-col
          min-h-full
          relative
          overflow-hidden
          bg-white
          border
          border-slate-300
        `}
      >
        <StageTop
          stage={stage}
          tasks={tasks}
          setTasks={setTasks}
        />
        <StageContent
          stage={stage}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
  )
}

export default Stage;