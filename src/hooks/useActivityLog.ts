import { TeamMember } from '@/store/projects/projects.slice';
import { Activity } from '@/utils/interfaces';
import { ActivityData, ActivityType } from '@/utils/types';
import useProjects from './useProjects';
import _ from "lodash";
import { createActivity } from '@/services/activity.api';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectActivities, selectIsLoading, selectPage, selectTotalPages } from '@/store/activity_log/activity_log.selectors';
import { useEffect, useMemo } from 'react';
import { setActivities, setPage } from '@/store/activity_log/activity_log.slice';
import { DEFAULT_PAGE } from '@/utils/constants';

const useActivityLog = () => {
    const {currentProject} = useProjects();

    const activities = useAppSelector(selectActivities);
    const isLoading = useAppSelector(selectIsLoading);
    const page = useAppSelector(selectPage);
    const totalPages = useAppSelector(selectTotalPages);
    
    const createNewActivity = async (
        type: ActivityType,
        user: TeamMember,
        data: ActivityData,
        projectId: string
    ): Promise<Activity> => {
        const response = await createActivity({type, user, data, projectId}); 

        return response.data as Activity;
    }

    const groupActivitiesByDate = (activities: Activity[]): Activity[] => {
        const groupedByDate = _.sortBy(activities, (activity) => activity.createdAt);
        console.table(groupedByDate);

        return !!groupedByDate.length
            ? groupedByDate
            : [];
    }

    // const memoizedActivities = useMemo(() => groupActivitiesByDate(currentProject?.activities ?? acts), [currentProject]);
    const memoizedActivities = useMemo(() => {
        if (!currentProject) {
            return [];
        }

        const ids = activities.map(({ activityId }) => activityId);
        const filtered = activities.filter(({ activityId }, index) => !ids.includes(activityId, index + 1));

        return filtered;
    }, [currentProject, activities]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if ((!currentProject && !!activities.length)) {
            dispatch(setActivities([]));
            dispatch(setPage(DEFAULT_PAGE));
        }
    }, [currentProject, activities, dispatch])

    useEffect(() => {
        if (currentProject?.projectId !== activities[0]?.projectId) {
            dispatch(setActivities([]));
            dispatch(setPage(DEFAULT_PAGE));
        }
    }, [currentProject, dispatch])


  return {
    createNewActivity,
    activities: memoizedActivities,
    isLoading,
    page,
    totalPages,
  }
}

export default useActivityLog;