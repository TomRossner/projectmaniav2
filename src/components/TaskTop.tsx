'use client'

import React, { useCallback, useState } from 'react';
import TaskTitle from './TaskTitle';
import ButtonWithIcon from './common/ButtonWithIcon';
import { BsThreeDots } from 'react-icons/bs';
import { IProject, IStage, ITask, setCurrentProject, setCurrentTask, updateProjectAsync } from '@/store/projects/projects.slice';
import { useAppDispatch } from '@/hooks/hooks';
import MoreOptions from './common/MoreOptions';
import { TASK_MENU_OPTIONS } from '@/utils/constants';
import useAuth from '@/hooks/useAuth';
import useModals from '@/hooks/useModals';
import useProjects from '@/hooks/useProjects';
import useActivityLog from '@/hooks/useActivityLog';
import { ActivityType, TOption } from '@/utils/types';
import { IUser } from '@/store/auth/auth.slice';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { getSocket } from '@/utils/socket';

type TaskTopProps = {
  title: string;
  task: ITask;
  additionalStyles?: string;
}

const TaskTop = ({
  title,
  task,
  additionalStyles
}: TaskTopProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {user} = useAuth();
  const {currentStage, currentProject, currentTask} = useProjects();
  const {createNewActivity, activities} = useActivityLog();
  const {openBackLayer, openEditTaskModal, closeEditTaskModal, openDeleteTaskModal} = useModals();
  const socket = getSocket();

  const toggleMenu = (): void => {
    dispatch(setCurrentTask(task));
    setIsMenuOpen(!isMenuOpen);
  }

  const openEditModal = () => {
    openBackLayer();
    openEditTaskModal();
  }

  const closeEditModal = () => {
    closeEditTaskModal();
  }

  const handleDelete = () => {
    openDeleteTaskModal();
  }

  const handleIsDone = useCallback(async (task: ITask) => {
    const {taskId} = task;

    const updatedTask: ITask = {
      ...task,
      isDone: !task.isDone,
      lastUpdatedBy: user?.userId as string,
    }

    const updatedTasks: ITask[] = currentStage?.tasks.map(t => {
      if (t.taskId === taskId) {
        return updatedTask;
      } else return t;
    }) as ITask[];

    const updatedStage: IStage = {
      ...currentStage,
      tasks: updatedTasks
    } as IStage;

    const updatedStages: IStage[] = currentProject?.stages.map(s => {
      if (s.stageId === currentStage?.stageId) {
        return updatedStage
      } else return s;
    }) as IStage[];

    const updatedProject: IProject = {
      ...currentProject,
      stages: updatedStages
    } as IProject;

    
    dispatch(setCurrentProject(updatedProject));
    
    socket?.emit('updateTask', updatedTask);
    
    const activityLog = await createNewActivity(
      ActivityType.UpdateIsDone,
      user as IUser,
      currentTask as ITask,
      currentProject?.projectId as string
    );

    dispatch(setActivities([
        ...activities,
        activityLog
    ]));
  }, [
      activities,
      dispatch,
      currentProject,
      currentStage,
      currentTask,
      user,
      socket,
      createNewActivity
  ]);

  const handleOptionClick = (opt: TOption): void => {
      setIsMenuOpen(false);

      switch (opt.text.toLowerCase()) {
          case 'done':
              handleIsDone(currentTask as ITask);
              break;
          case 'reset':
              handleIsDone(currentTask as ITask);
              break;
          case 'edit':
              return openEditModal();
          case 'delete':
              return handleDelete();
          default:
              return closeEditModal();
      }
  }

  return (
    <div className='flex items-center w-full justify-between relative'>
        <TaskTitle
          title={title}
          additionalStyles={additionalStyles}
        />

        <ButtonWithIcon
          icon={<BsThreeDots />}
          action={toggleMenu}
          additionalStyles='bg-slate-100 hover:bg-slate-50 transition-color'
          title='More options'
        />

        {/* <TaskMenu
          setIsMenuOpen={setIsMenuOpen}
          menuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        /> */}

        <MoreOptions
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          options={TASK_MENU_OPTIONS}
          action={handleOptionClick}
        />
    </div>
  )
};

export default TaskTop;