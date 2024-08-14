'use client'

import isAuth from '@/app/ProtectedRoute';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import NewTaskModal from '@/components/modals/NewTaskModal';
import DashboardTop from '@/components/DashboardTop';
import Stage from '@/components/Stage';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { IProject, IStage, ITask, setCurrentProject, setCurrentStage, setCurrentStageIndex, setStages } from '@/store/projects/projects.slice';
import useProjects from '@/hooks/useProjects';
import NewStageModal from '@/components/modals/NewStageModal';
import DeleteStagePrompt from '@/components/modals/DeleteStagePrompt';
import { updateProject } from '@/services/projects.api';
import { ScrollDirection } from '@/utils/types';
import { scrollToIndex } from '@/utils/utils';
import DeleteProjectPrompt from '@/components/modals/DeleteProjectPrompt';
import { redirect, useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import EditTaskModal from '@/components/modals/EditTaskModal';
import DeleteTaskPrompt from '@/components/modals/DeleteTaskPrompt';
import EditStageModal from '@/components/modals/EditStageModal';
import EditDashboardModal from '@/components/modals/EditProjectModal';
import { AxiosResponse } from 'axios';
import { IUser, setUser } from '@/store/auth/auth.slice';
import useAuth from '@/hooks/useAuth';
import { updateUserData } from '@/services/user.api';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, closestCorners, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import InvitationModal from '@/components/modals/InvitationModal';
import LoadingModal from '@/components/modals/LoadingModal';
import { selectIsJoiningProject, selectIsLeavingProject } from '@/store/projects/projects.selectors';
import ActivityLog from '@/components/ActivityLog';
import { fetchActivityLogAsync } from '@/store/activity_log/activity_log.slice';
import { getSocket } from '@/utils/socket';

const Project = () => {
  const {user, userId} = useAuth();
  const {
    currentProject,
    stages,
    currentStage,
    currentStageIndex,
    currentTask,
  } = useProjects();
  const socket = getSocket();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [noMoreNext, setNoMoreNext] = useState<boolean>(false);
  const [noMorePrev, setNoMorePrev] = useState<boolean>(false);

  const stagesContainerRef = useRef<HTMLDivElement>(null);

  const updateCurrentStageIndex = useCallback((direction: ScrollDirection, totalStages: number): void => {
    if (direction === 'next' && currentStageIndex < totalStages) {
      dispatch(setCurrentStageIndex(currentStageIndex + 1));
    } else if (direction === 'prev' && currentStageIndex > 0) {
      dispatch(setCurrentStageIndex(currentStageIndex - 1));
    }
  }, [currentStageIndex, dispatch])

  const handleScroll = (direction: ScrollDirection) => {
    if (stages.length === 1) return;
    
    const container = stagesContainerRef.current as HTMLDivElement;
    
    // container.children.length
    const totalStages = container.children.length - 1;

    updateCurrentStageIndex(direction, totalStages);

    scrollToIndex(currentStageIndex, direction, container);
  }

  const moveNext = () => handleScroll('next');
  const movePrev = () => handleScroll('prev');

  const [activeStage, setActiveStage] = useState<IStage | null>(null);

  const handleUpdateProject = async (project: IProject): Promise<AxiosResponse> => {
    // await newUpdateProject(project);
    return await updateProject(project);
  }

  const handleDisableNextAndPrevButtons = useCallback((index: number, stagesLength: number): void => {
    if (stagesLength <= 1) {
      setNoMoreNext(true);
      setNoMorePrev(true);
      
      return;
    }

    stagesLength = stagesLength - 1;

    if (index === stagesLength) setNoMoreNext(true);
    if (index === 0 && stagesLength) setNoMorePrev(true);

    if (index !== stagesLength && noMoreNext) setNoMoreNext(false);
    if (index > 0 && noMorePrev) setNoMorePrev(false);
  }, [noMoreNext,noMorePrev]);

  // const onDragStart = (ev: DragStartEvent) => {
  //   if (ev.active.data.current?.type === "stage") {
  //     setActiveStage(ev.active.data.current.stage);
  //     return;
  //   }
  // }

  // const onDragEnd = (ev: DragEndEvent) => {
  //   setActiveStage(null);
  //   const {active, over} = ev;

  //   if (!over) return;

  //   const oldIndex = stages.findIndex(s => s.stageId === active.id);
  //   const newIndex = stages.findIndex(s => s.stageId === over.id);

  //   const newTasks = arrayMove(stages, oldIndex, newIndex);

  //   if (oldIndex === newIndex) return;

  //   dispatch(setStages(newTasks));
  // }

  // const mouseSensor = useSensor(MouseSensor, {
  //   activationConstraint: {
  //     distance: 5
  //   },
  // });

  // Set currentStageIndex to 0
  useEffect(() => {
    dispatch(setCurrentStageIndex(0));
  }, [dispatch])
  
  // Update currentProject's stages when stages change
  useEffect(() => {
    if (currentProject) {
      dispatch(setStages(currentProject.stages));
    }
  }, [currentProject, dispatch])

  // Set currentStage to be the first stage of currentProject if null, happens on mount.
  useEffect(() => {
    if (currentProject && stages.length && !currentStage) {
      dispatch(setCurrentStage(currentProject.stages[0]));
    }
  }, [stages, currentStage, dispatch, currentProject])

  // Update currentProject in API when changed
  useEffect(() => {
    if (currentProject) {
      // Update project in API
      handleUpdateProject(currentProject);
      
    } else if (!currentProject) router.push(LINKS.PROJECTS);
  }, [currentProject])

  // Update currentStage when currentStageIndex changes
  useEffect(() => {
    if (currentStageIndex < 0) setCurrentStageIndex(0);
    else dispatch(setCurrentStage(stages[currentStageIndex]));
  }, [currentStageIndex, dispatch, stages])

  // Update buttons disable attribute when currenStageIndex changes
  useEffect(() => {
      handleDisableNextAndPrevButtons(currentStageIndex, stages.length);
  }, [currentStageIndex, stages.length, handleDisableNextAndPrevButtons])

  // Update currentStage when stages change
  useEffect(() => {
    if (!stages.length && currentStage) dispatch(setCurrentStage(null));

    const updatedCurrentStage: IStage = stages.find((stage: IStage) => stage.stageId === currentStage?.stageId) as IStage;
    if (currentStage) dispatch(setCurrentStage(updatedCurrentStage));
  }, [stages, currentStage, dispatch])

  // Update next and previous buttons when currentStage changes
  useEffect(() => {
    handleDisableNextAndPrevButtons(currentStageIndex, stages.length);
  }, [currentStage, currentStageIndex, stages, handleDisableNextAndPrevButtons])

  // Set mostRecentProject and update user
  useEffect(() => {
    if (user?.mostRecentProject?.projectId !== currentProject?.projectId) {
      const updatedUser: IUser = {
        ...user,
        mostRecentProject: {
          projectId: currentProject?.projectId,
          title: currentProject?.title,
        }
      } as IUser;
  
      updateUserData(updatedUser)
        .then(res => dispatch(setUser(res.data)));
    }
  }, [currentProject, user, dispatch])

  const [isScrolledToLeft, setIsScrolledToLeft] = useState<boolean>(false);
  const [isScrolledToRight, setIsScrolledToRight] = useState<boolean>(false);

  // Handle side scroll
  useEffect(() => {
    const container = stagesContainerRef.current;

    const handleScroll = (): void => {
      if (container) {

        const scrollLeft: number = container.scrollLeft;
        const scrollWidth: number = container.scrollWidth;
        const clientWidth: number = container.clientWidth;

        setIsScrolledToLeft(scrollLeft === 0);
        setIsScrolledToRight(scrollLeft + clientWidth >= scrollWidth);
      }
    }

    if (container) container.addEventListener('scroll', handleScroll);
  }, [])
  
  const isJoiningProject = useAppSelector(selectIsJoiningProject);
  const isLeavingProject = useAppSelector(selectIsLeavingProject);

  useEffect(() => {
    dispatch(fetchActivityLogAsync(currentProject?.projectId as string)); 
  }, [currentProject?.projectId, dispatch])

  useEffect(() => {
    if (user && currentProject && socket) {
      const handleNewTask = async (data: ITask) => {
        console.log("newTask", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject?.stages.map(s =>
              s.stageId === data.currentStage?.stageId
                ? {
                  ...s,
                  tasks: [...s.tasks, data]
                } : s
            ) as IStage[],
          ],
        } as IProject));
      }

      const handleDeleteTask = async (data: ITask) => {
        console.log("deleteTask", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject?.stages.map(s =>
              s.stageId === data.currentStage?.stageId
                ? {
                  ...s,
                  tasks: [...s.tasks.filter(t => t.taskId !== data.taskId)]
                } : s
            ) as IStage[],
          ],
        } as IProject));
      }

      const handleUpdateTask = async (data: ITask) => {
        console.log("updateTask", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject?.stages.map(s =>
              s.stageId === data.currentStage?.stageId
                ? {
                  ...s,
                  tasks: [...s.tasks.map(t => t.taskId === data.taskId ? data : t)]
                } : s
            ) as IStage[],
          ],
        } as IProject));
      }

      const handleNewStage = async (data: IStage) => {
        console.log("newStage", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject.stages, data
          ],
        } as IProject));
      }

      const handleDeleteStage = async (data: IStage) => {
        console.log("deleteStage", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject?.stages.filter(s => s.stageId !== data.stageId)
          ],
        } as IProject));
      }

      const handleUpdateStage = async (data: IStage) => {
        console.log("updateStage", data);
        
        dispatch(setCurrentProject({
          ...currentProject,
          stages: [
            ...currentProject?.stages.map(s => s.stageId === data.stageId ? data : s)
          ],
        } as IProject));
      }

      const handleUpdateProject = async (data: IProject) => {
        console.log("updateProject", data);
        
        dispatch(setCurrentProject(data));
      }

      socket.on("connect", () => {
        console.log("Socket now connected: ", socket?.id);
      });
      
      socket.emit('updateSocketId', {
        userId,
        socketId: socket.id as string
      });

      socket
        .on('newTask', handleNewTask)
        .on('deleteTask', handleDeleteTask)
        .on('updateTask', handleUpdateTask)

        .on('newStage', handleNewStage)
        .on('deleteStage', handleDeleteStage)
        .on('updateStage', handleUpdateStage)
        
        .on('updateProject', handleUpdateProject)
    }
  }, [socket, currentProject, userId, user])

  return (
    <>
    <DeleteProjectPrompt />
    <DeleteStagePrompt />
    <DeleteTaskPrompt />
    <EditDashboardModal />
    <EditStageModal />
    <EditTaskModal task={currentTask as ITask} />
    <NewStageModal />
    <NewTaskModal />
    <InvitationModal />
    <LoadingModal
      isOpen={isJoiningProject || isLeavingProject}
      text={
        isJoiningProject
          ? 'Joining project...'
          : isLeavingProject
            ? 'Leaving project...'
            : ''
      }
    />
    <ActivityLog />

    <div className='flex justify-end w-full h-[90vh]'>
        <div className='p-2 flex items-start justify-center grow max-w-screen-lg w-full mb-2'>
            <div
              className={`
                grow
                self-stretch
                border
                p-4
                border-stone-500
                rounded-bl-lg
                w-full
                flex
                flex-col
                items-center
              `}
            >
                <DashboardTop
                  noMoreNext={noMoreNext}
                  noMorePrev={noMorePrev}
                  moveNext={moveNext}
                  movePrev={movePrev}
                />

                <div
                  id='stagesContainer'
                  ref={stagesContainerRef}
                  className={`
                    w-full
                    rounded-bl-lg
                    grow
                    snap-x
                    snap-mandatory
                    flex
                    overflow-x-auto
                    gap-5
                    border
                    border-slate-200
                    h-full
                  `}
                >
                  {currentProject?.stages.map((stage: IStage) =>
                    <Stage {...stage} key={stage.stageId} />
                  )}
                  {/* <DndContext
                    collisionDetection={closestCorners}
                    sensors={[mouseSensor]}
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                  >
                    <SortableContext
                      strategy={horizontalListSortingStrategy}
                      items={stagesIds}
                    >
                      {currentProject?.stages.map((stage: Stage) =>
                        <Stage {...stage} key={stage.stageId} />
                      )}

                      <DragOverlay>
                        {activeStage && (
                          <Stage {...activeStage} /> 
                        )}
                      </DragOverlay>
                    </SortableContext>
                  </DndContext> */}
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default isAuth(Project);