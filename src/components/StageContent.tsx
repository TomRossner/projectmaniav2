'use client'

import React from 'react';
import BigPlus from './utils/BigPlus';
import { IStage, ITask } from '@/store/projects/projects.slice';
import Task from './Task';
import Button from './common/Button';
import { Reorder } from 'framer-motion';

type StageContentProps = {
  stage: IStage;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}

const StageContent = ({stage, tasks, setTasks}: StageContentProps) => {

  return (
    <div className='w-full flex justify-center grow overflow-hidden relative'>
        {tasks.length ? (
            <Reorder.Group values={tasks} onReorder={setTasks} className='w-full flex flex-col px-4 gap-3 items-start py-5 overflow-y-scroll'>
                {tasks.map((task: ITask, index: number) =>
                  <Reorder.Item
                    value={task}
                    key={task.taskId}
                    className='w-full'
                  >
                    <Task
                      task={task}
                      idx={index}
                      setTasks={setTasks}
                    />
                  </Reorder.Item>
                )}
            </Reorder.Group>
        ) : (
          <>
            {!!stage.tasks.length && !tasks.length ? (
              <div className='flex flex-col gap-3 w-full h-fit m-auto'>
                <p className='p-2 w-full text-center'>There are no tasks matching your filters, reset filters and try again.</p>

                <Button
                  action={() => setTasks(stage.tasks)}
                  type='button'
                  additionalStyles='self-center justify-start'
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <span className='flex items-center justify-center h-1/3 my-auto w-full'>
                <BigPlus />
              </span>
            )}
          </>
        )}
    </div>
  )
}

export default StageContent;