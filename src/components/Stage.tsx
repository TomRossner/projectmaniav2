'use client'

import React, { useEffect, useState } from 'react';
import StageTop from './StageTop';
import StageContent from './StageContent';
import { useAppDispatch } from '@/hooks/hooks';
import { IStage, ITask, setCurrentStage } from '@/store/projects/projects.slice';

const Stage = (stage: IStage) => {
    const dispatch = useAppDispatch();
    const [tasks, setTasks] = useState<ITask[]>([]);

    useEffect(() => {
      setTasks(stage.tasks);
    }, [stage.tasks]);

  return (
      <div
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