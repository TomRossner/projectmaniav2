import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectProjectsSlice } from '@/store/projects/projects.selectors';
import { fetchAllProjectsAsync, fetchPaginatedProjectsAsync, IProject, IStage, ITask, joinProjectAsync, leaveProjectAsync, setCurrentProject, setProjects, TeamMember } from '@/store/projects/projects.slice';
import useAuth from './useAuth';
import { AxiosError } from 'axios';
import { getProject, getTask } from '@/services/projects.api';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import useNotifications from './useNotifications';
import { setErrorMsg } from '@/store/error/error.slice';
import { IUser, updateUserAsync } from '@/store/auth/auth.slice';
import { getHowLongAgo } from '@/utils/dates';

const useProjects = () => {
    const {
      projects,
      currentProject,
      currentStage,
      currentTask,
      isFetching,
      currentStageIndex,
      page,
      totalPages,
    } = useAppSelector(selectProjectsSlice);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const {user, userId, isAuthenticated} = useAuth();
    const {handleRemoveNotification} = useNotifications();
    // const {createNewActivity, activities} = useActivityLog();

    const tasks = useMemo(() => currentProject?.stages.flatMap(s => s.tasks) ?? [], [currentProject]);

    // useEffect(() => {
    //   if (tasks.length) {
    //     console.log(tasks)

    //     const notFound: ITask[] = [];

    //     for (const task of tasks) {
    //       try {
    //         getTask(task.taskId)
    //           .then(res => res.data ? console.log(res.data) : notFound.push(task))
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     }
    //     console.log(notFound)
    //   }
    // }, [tasks])

    const stages = useMemo(() => currentProject?.stages ?? [], [currentProject]);

    const projectId = useMemo(() => currentProject?.projectId, [currentProject]);

    const memoizedProjects = useMemo(() => {
      const ids = projects.map(({ projectId }) => projectId);
      const filtered = projects.filter(({ projectId }, index) => !ids.includes(projectId, index + 1));
      return filtered;
    }, [projects])

    const handleError = (error: AxiosError) => {
      if (error.code === 'ERR_NETWORK') {
          dispatch(setErrorMsg(`Failed handling HTTP request - ${error.message.toLowerCase()}`));
          return;
      } else {
        console.error(error);
        dispatch(setErrorMsg('An error occurred while loading projects'));
      };
    }

    const getAllProjects = async (userId: string) => {
      return await dispatch(fetchAllProjectsAsync(userId))
        .unwrap()
        .catch(error => dispatch(setErrorMsg("We couldn't get your projects. Please try again later")));
    }

    const getPaginatedProjects = async (userId: string, limit?: number) => {
      return await dispatch(fetchPaginatedProjectsAsync({userId, page, limit}))
        .unwrap()
        .catch(error => dispatch(setErrorMsg("We couldn't get your projects. Please try again later")));
    }

    const getMostRecentProject = async (userMostRecentProject: Pick<IProject, "projectId" | "title">): Promise<IProject | null> => {
      try {
        if (userMostRecentProject.projectId) {
          const response = await getProject(userMostRecentProject.projectId as string);

          if (response.status !== 200) {
            throw "Couldn't find most recent project";
          }

          return response.data;
        } else return null;
      } catch (error) {
        console.error(error);
        
        handleError(error as AxiosError);
        return null;
      }
    }

    const updateProjectTasks = useCallback((tasks: ITask[], stage: IStage) => {
      const updatedStages = currentProject?.stages.map(s => {
        if (s.stageId === stage.stageId) {
          return {
            ...s,
            tasks
          }
        } else return s;
      }) as IStage[];
  
      const updatedProject: IProject = {
        ...currentProject,
        stages: updatedStages as IStage[]
      } as IProject;
  
      dispatch(setCurrentProject(updatedProject));
    }, [currentProject, dispatch]);

    const handleJoinProject = useCallback((projectData: Pick<IProject, "projectId" | "title">, user: IUser) => {
      if (currentProject?.team.some(u => u.userId === user.userId)) return;
      
      dispatch(joinProjectAsync({projectData, user}));
    }, [currentProject, dispatch]);

    const handleLeaveProject = useCallback(async (projectId: string, userId: string) => {
      dispatch(leaveProjectAsync({projectId, userId}));

      const updatedUser = {
        ...user,
        mostRecentProject: null,
      } as IUser;
      
      dispatch(updateUserAsync(updatedUser));
      // const activityLog =  await createNewActivity(
      //   ActivityType.LeaveProject,
      //   user as IUser,
      //   currentProject as IProject,
      //   currentProject?.projectId as string
      // );

      // dispatch(setActivities([
      //     ...activities,
      //     activityLog
      // ]));

      
      router.push(LINKS.HOME);
    }, [user, dispatch, router]);

  return {
    projects: memoizedProjects,
    currentProject,
    currentStage,
    currentTask,
    isFetching,
    stages,
    tasks,
    currentStageIndex,
    projectId,
    page,
    totalPages,
    getAllProjects,
    // getAllUserProjects,
    handleError,
    getPaginatedProjects,
    updateProjectTasks,
    handleLeaveProject,
    handleJoinProject,
    getMostRecentProject,
  }
}

export default useProjects;