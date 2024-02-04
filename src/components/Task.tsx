import { ITask, setCurrentTask } from '@/store/projects/projects.slice';
import React from 'react';
import TaskTop from './TaskTop';
import TaskPriority from './TaskPriority';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

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

    const dispatch = useDispatch();

  return (
    <div onClick={() => dispatch(setCurrentTask(task))} className='w-full max-w-[400px] min-h-[100px] flex flex-col flex-wrap px-3 py-2 gap-3 rounded-bl-lg border border-slate-300 cursor-pointer transition-all bg-slate-200 hover:border-blue-500 hover:bg-slate-50'>
        {task.imgSrc && (
          <div className='w-full h-32 flex items-start overflow-clip rounded-bl-lg border border-stone-200'>
            <Image src={task.imgSrc} width={100} height={60} alt='Thumbnail' className='opacity-75 aspect-auto w-full h-auto'/>
          </div>
        )}
        
        <TaskTop task={task} title={title}/>

        <p className='line-clamp-3 w-full'>{description}</p>

        <TaskPriority priority={priority}/>
    </div>
  )
}

export default Task;