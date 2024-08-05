import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectProjectsSlice } from '@/store/projects/projects.selectors';
import { fetchProjectsAsync, IProject, IStage, ITask, joinProjectAsync, leaveProjectAsync, setCurrentProject, setProjects, TeamMember } from '@/store/projects/projects.slice';
import useAuth from './useAuth';
import { AxiosError } from 'axios';
import { getProject, updateProject } from '@/services/projects.api';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import useNotifications from './useNotifications';
import { setErrorMsg } from '@/store/error/error.slice';
import { IUser } from '@/store/auth/auth.slice';
import { updateUserData } from '@/services/user.api';
import { ActivityType } from '@/utils/types';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import useActivityLog from './useActivityLog';

const useProjects = () => {
    const {
      projects,
      currentProject,
      currentStage,
      currentTask,
      isFetching,
      currentStageIndex,
    } = useAppSelector(selectProjectsSlice);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const {user, isAuthenticated} = useAuth();
    const {handleRemoveNotification} = useNotifications();
    // const {createNewActivity, activities} = useActivityLog();

    const tasks = useMemo(() =>
      currentProject?.stages.flatMap(s => s.tasks) ?? [], [currentProject]);

    const stages = useMemo(() => currentProject?.stages ?? [], [currentProject]);

    const projectId = useMemo(() => currentProject?.projectId, [currentProject]);

    const handleError = (error: AxiosError): void => {
      if (error.code === 'ERR_NETWORK') {
          dispatch(setErrorMsg(`Failed handling HTTP request - ${error.message.toLowerCase()}`));
          return;
      } else dispatch(setErrorMsg('An error occurred while loading projects'));
    }

    const getProjects = async () => {
      return await dispatch(fetchProjectsAsync(user?.userId as string))
          .unwrap()
          .catch((error) => handleError(error));
    }

    const getUserProjects = (userId: string) => {
      dispatch(fetchProjectsAsync(userId));
    }

    const getMostRecentProject = async (userMostRecentProject: Pick<IProject, "projectId" | "title">): Promise<IProject | null> => {
      try {
        if (userMostRecentProject) {
          const {data: project} = await getProject(userMostRecentProject.projectId as string);
          return project;
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
      
      await updateUserData(updatedUser);

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
    projects,
    currentProject,
    currentStage,
    currentTask,
    isFetching,
    stages,
    tasks,
    currentStageIndex,
    projectId,
    getProjects,
    handleError,
    getUserProjects,
    updateProjectTasks,
    handleLeaveProject,
    handleJoinProject,
    getMostRecentProject,
  }
}

export default useProjects;