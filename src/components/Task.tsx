import { ITask } from '@/store/projects/projects.slice';
import React from 'react';
import TaskTop from './TaskTop';
import TaskPriority from './TaskPriority';

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

  return (
    <div onClick={() => console.log(task)} className='w-full max-w-[400px] min-h-[400px] max-h-[400px] flex flex-col flex-wrap px-3 py-2 justify-between rounded-bl-lg border border-slate-300 cursor-pointer transition-all bg-slate-200 hover:border-blue-500 hover:bg-slate-50'>
        <TaskTop title={title}/>

        <p>{description}</p>

        <TaskPriority priority={priority}/>
    </div>
  )
}

export default Task;