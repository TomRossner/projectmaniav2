'use client'

import React, { useEffect, useState } from 'react';
import BigPlus from './BigPlus';
import { IStage, ITask } from '@/store/projects/projects.slice';
import Task from './Task';

const StageContent = (stage: IStage) => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    setTasks(stage.tasks);
  }, [stage])
  
  return (
    <div className='w-full h-full rounded-bl-lg bg-slate-100 flex justify-center overflow-y-scroll'>
        {tasks.length ? (
          <div className='w-full flex flex-col p-4 gap-3 items-start'>
            {tasks.map((task: ITask, index: number) =>
                <Task key={index} {...task}/>
            )}
          </div>
        ) : <span className='flex items-center justify-center h-1/3 my-auto w-full'><BigPlus/></span>}
    </div>
  )
}

export default StageContent;