'use client'

import React, { useMemo, useState } from 'react';
import BigPlus from './utils/BigPlus';
import { IStage, ITask, setFilters } from '@/store/projects/projects.slice';
import Task from './Task';
import Button from './common/Button';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, closestCorners, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';

type StageContentProps = {
  stage: IStage;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}

const StageContent = ({stage, tasks, setTasks}: StageContentProps) => {
  const dispatch = useAppDispatch();
  const {updateProjectTasks, currentProject} = useProjects();
  const tasksIds = useMemo(() => tasks.map(t => ({id: t.taskId})), [tasks]);

  const resetFilters = () => {
    dispatch(setFilters([]));
    setTasks(stage.tasks);
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    }
  });

  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const onDragEnd = (ev: DragEndEvent) => {
    setActiveTask(null);
    const {active, over} = ev;

    if (!over) return;

    const oldIndex = tasks.findIndex(t => t.taskId === active.id);
    const newIndex = tasks.findIndex(t => t.taskId === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    updateProjectTasks(newTasks, stage);

    setTasks(newTasks);
  }

  const onDragStart = (ev: DragStartEvent) => {
    if (ev.active.data.current?.type === "task") {
      setActiveTask(ev.active.data.current.task);
      return;
    }
  }

  const onDragOver = (ev: DragOverEvent) => {
    const {active, over} = ev;

    if (!over) return;

    const oldIndex = tasks.findIndex(t => t.taskId === active.id);
    const newIndex = tasks.findIndex(t => t.taskId === over.id);

    if (oldIndex === newIndex) return;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      const updateTasks = (tasks: ITask[]): ITask[] => {
        const activeIndex = tasks.findIndex(t => t.taskId === active.id);
        const overIndex = tasks.findIndex(t => t.taskId === over.id);

        tasks = tasks.map(t => {
          if (t.taskId === active.id) {
            return {
              ...tasks[activeIndex],
              currentStage: tasks[oldIndex].currentStage
            }
          } else return t;
        }) as ITask[];
        // console.log(arrayMove(tasks, activeIndex, overIndex))
        return arrayMove(tasks, activeIndex, overIndex);
      }

      const updatedTasks = updateTasks(tasks);

      setTasks(updatedTasks);
    }

    const isOverAStage = active.data.current?.type === "stage";
    if (isOverAStage) {
      console.log("Stage", over);
    }

    if (isActiveATask && isOverAStage) {
      const updateTasks = (tasks: ITask[]): ITask[] => {
        const activeIndex = tasks.findIndex(t => t.taskId === active.id);
        // tasks[activeIndex].currentStage = tasks[oldIndex].currentStage;

        return arrayMove(tasks, activeIndex, activeIndex);
      }

      updateProjectTasks(updateTasks(tasks), stage);
      setTasks(updateTasks(tasks));
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
                onDragOver={onDragOver}
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
                  {createPortal(
                    <DragOverlay>
                      {activeTask && (
                        <Task
                          animate={false}
                          task={activeTask}
                          setTasks={setTasks}
                          idx={tasks.findIndex(t => t.taskId === activeTask.taskId)}
                        />
                      )}
                    </DragOverlay>,
                    document.body
                  )}
                </SortableContext>
              </DndContext>
            </div>
        ) : (
          <>
            {!!stage.tasks.length && !tasks.length ? (
              <div className='flex flex-col gap-3 w-full h-fit m-auto'>
                <p className='p-2 w-full text-center'>There are no tasks matching your filters, reset filters and try again.</p>

                <Button
                  action={resetFilters}
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