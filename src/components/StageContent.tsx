'use client'

import React, { useMemo, useState } from 'react';
import BigPlus from './utils/BigPlus';
import { IStage, ITask } from '@/store/projects/projects.slice';
import Task from './Task';
import Button from './common/Button';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, closestCorners, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

type StageContentProps = {
  stage: IStage;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}

const StageContent = ({stage, tasks, setTasks}: StageContentProps) => {

  const tasksIds = useMemo(() => tasks.map(t => ({id: t.taskId})), [tasks]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    }
  });

  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const onDragEnd = (ev: DragEndEvent) => {
    const {active, over} = ev;

    if (!over) return;

    const oldIndex = tasks.findIndex(t => t.taskId === active.id);
    const newIndex = tasks.findIndex(t => t.taskId === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);

    if (oldIndex === newIndex) return;

    setTasks(newTasks);
  }

  const onDragStart = (ev: DragStartEvent) => {
    if (ev.active.data.current?.type === "task") {
      setActiveTask(ev.active.data.current.task);
      return;
    }
  }

  return (
    <div
      className='w-full flex justify-center grow overflow-hidden relative'
    >
        {tasks.length ? (
            <div className='w-full flex flex-col px-4 gap-3 items-start py-5 overflow-y-scroll overflow-x-hidden'>
              <DndContext
                collisionDetection={closestCorners}
                sensors={[mouseSensor]}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
              >
                <SortableContext
                  items={tasksIds}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.map((task: ITask, index: number) =>
                    <Task
                      key={task.taskId}
                      task={task}
                      idx={index}
                      setTasks={setTasks}
                    />
                  )}
                  <DragOverlay>
                    {activeTask && (
                      <Task
                        animate={false}
                        task={activeTask}
                        setTasks={setTasks}
                        idx={tasks.findIndex(t => t.taskId === activeTask.taskId)}
                      /> 
                    )}
                  </DragOverlay>
                </SortableContext>
              </DndContext>
            </div>
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