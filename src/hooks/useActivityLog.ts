import { IStage, ITask, TeamMember } from '@/store/projects/projects.slice';
import { Activity } from '@/utils/interfaces';
import { ActivityData, ActivityType } from '@/utils/types';
import useProjects from './useProjects';
import _ from "lodash";
import useAuth from './useAuth';
import { IUser } from '@/store/auth/auth.slice';
import { generateId } from '@/utils/utils';
import { createActivity } from '@/services/activity.api';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectActivities, selectIsLoading } from '@/store/activity_log/activity_log.selectors';
import { useEffect } from 'react';
import { setActivities } from '@/store/activity_log/activity_log.slice';

const useActivityLog = () => {
    const {currentProject} = useProjects();
    const {user} = useAuth();

    const activities = useAppSelector(selectActivities);
    const isLoading = useAppSelector(selectIsLoading);
    
    const createNewActivity = async (type: ActivityType, user: TeamMember, data: ActivityData, projectId: string): Promise<Activity> => {
        const response = await createActivity({type, user, data, projectId}); 

        return response.data as Activity;
    }

    const acts: Activity[] = [
        {
            activityId: generateId(),
            createdAt: new Date(Date.now()),
            createdBy: user?.userId as string,
            data: currentProject?.stages[0] as IStage,
            type: ActivityType.AddTask,
            updatedAt: new Date(Date.now()),
            user: user as IUser,
            projectId: currentProject?.projectId as string,
        },
        {
            activityId: generateId(),
            createdAt: new Date(Date.now()),
            createdBy: user?.userId as string,
            data: currentProject?.stages[0].tasks[0] as ITask,
            type: ActivityType.AddDescription,
            updatedAt: new Date(Date.now()),
            user: user as IUser,
            projectId: currentProject?.projectId as string,
        },
        {
            activityId: generateId(),
            createdAt: new Date(Date.now()),
            createdBy: user?.userId as string,
            data: {
                email: 'billgates@gmail.com',
                firstName: 'Bill',
                lastName: 'Gates',
                imgSrc: user?.imgSrc,
                isOnline: false,
                userId: user?.userId
            } as TeamMember,
            type: ActivityType.JoinProject,
            updatedAt: new Date(Date.now()),
            user: user as IUser,
            projectId: currentProject?.projectId as string,
        },
        {
            activityId: generateId(),
            createdAt: new Date(Date.now()),
            createdBy: user?.userId as string,
            data: currentProject?.stages[0].tasks[0] as ITask,
            type: ActivityType.DeleteTask,
            updatedAt: new Date(Date.now()),
            user: user as IUser,
            projectId: currentProject?.projectId as string,
        },
    ]

    const groupActivitiesByDate = (activities: Activity[]): Activity[] => {
        const groupedByDate = _.sortBy(activities, (activity) => activity.createdAt);
        console.table(groupedByDate);

        return !!groupedByDate.length
            ? groupedByDate
            : [];
    }

    // const memoizedActivities = useMemo(() => groupActivitiesByDate(currentProject?.activities ?? acts), [currentProject]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log(activities)
        if (!currentProject && !!activities.length) {
            dispatch(setActivities([]));
        }
    }, [currentProject, activities])


  return {
    createNewActivity,
    activities,
    isLoading,
  }
}

export default useActivityLog;