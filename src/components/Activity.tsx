import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import { IProject, IStage, ITask, TeamMember } from '@/store/projects/projects.slice';
import { getHowLongAgo } from '@/utils/dates';
import { Activity } from '@/utils/interfaces';
import { ActivityData, ActivityType } from '@/utils/types';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import ImageWithFallback from './common/ImageWithFallback';

type ActivityProps = {
    activity: Activity;
}

const ActivityItem = ({activity}: ActivityProps) => {
    const {
        activityId,
        data,
        createdAt,
        type,
        user: {
            email,
            firstName,
            imgSrc,
            isOnline,
            lastName,
            userId
        },
    } = activity;
    const {currentProject} = useProjects();

    const {getUserName, userInitials} = useAuth();

    const isTask = (data: ActivityData): data is ITask => {
        return (data as ITask) !== undefined;
    }
    const isStage = (data: ActivityData): data is IStage => {
        return (data as IStage) !== undefined;
    }
    const isProject = (data: ActivityData): data is IProject => {
        return (data as IProject) !== undefined;
    }
    const isUser = (data: ActivityData): data is TeamMember => {
        return (data as TeamMember) !== undefined;
    }

    const renderText = useCallback((type: ActivityType): string => {
        switch (type) {
            case ActivityType.AddTask:
                return `added a new task to "${isStage(data) && data.title}"`;
            case ActivityType.UpdateTask:
                return `updated "${isTask(data) && data.title}"`;
            case ActivityType.DeleteTask:
                return `deleted "${isTask(data) && data.title}"`;
            
            case ActivityType.UpdatePriority:
                return `updated the priority of "${isTask(data) && data.title}"`;
            case ActivityType.UpdateTaskTitle:
                return `updated the title of "${isTask(data) && data.title}"`;
            case ActivityType.UpdateStageTitle:
                return `updated the title of "${isStage(data) && data.title}"`;
            case ActivityType.UpdateProjectTitle:
                return `changed the project's title to ${isProject(data) && data.title}`;
            case ActivityType.UpdateDueDate:
                return `updated the due date of "${isTask(data) && data.title}"`;
            case ActivityType.UpdateCurrentStage:
                return `moved a task to "${isStage(data) && data.title}"`;
            case ActivityType.UpdateIsDone:
                return `changed "${isTask(data) && data.title}" to ${isTask(data) && data.isDone === true ? 'uncompleted' : 'completed'}`;

            case ActivityType.AddTag:
                return `added a tag to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateTag:
                return `updated tags for "${isTask(data) && data.title}"`;
            case ActivityType.DeleteTag:
                return `removed tags from "${isTask(data) && data.title}"`;

            case ActivityType.AddDescription:
                return `added a description to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateDescription:
                return `updated the description of "${isTask(data) && data.title}"`;
            case ActivityType.DeleteDescription:
                return `removed the description from "${isTask(data) && data.title}"`;
            
            case ActivityType.AddAssignee:
                return `assigned a task to ${isUser(data) && getUserName(data)}`;
            case ActivityType.UpdateAssignee:
                return `updated the assignees for "${isTask(data) && data.title}"`;
            case ActivityType.DeleteAssignee:
                return `unassigned a task for ${isUser(data) && getUserName(data)}`;
            
            case ActivityType.AddSubtask:
                return `added a subtask to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateSubtask:
                return `updated the subtasks of "${isTask(data) && data.title}"`;
            case ActivityType.DeleteSubtask:
                return `removed subtasks from "${isTask(data) && data.title}"`;
            
            case ActivityType.AddExternalLink:
                return `added external links to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateExternalLink:
                return `updated external links of "${isTask(data) && data.title}"`;
            case ActivityType.DeleteExternalLink:
                return `removed external links from "${isTask(data) && data.title}"`;
            
            case ActivityType.AddDependency:
                return `added dependencies to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateDependency:
                return `updated the dependencies of "${isTask(data) && data.title}"`;
            case ActivityType.DeleteDependency:
                return `removed dependencies from "${isTask(data) && data.title}"`;
            
            case ActivityType.AddThumbnail:
                return `added a thumbnail to "${isTask(data) && data.title}"`;
            case ActivityType.UpdateThumbnail:
                return `updated the thumbnail of "${isTask(data) && data.title}"`;
            case ActivityType.DeleteThumbnail:
                return `removed the thumbnail of "${isTask(data) && data.title}"`;
            
            case ActivityType.AddStage:
                return `added "${isStage(data) && data.title}"`;
            case ActivityType.DeleteStage:
                return `removed "${isStage(data) && data.title}"`;

            case ActivityType.CreateProject:
                return `created ${isProject(data) && data.title}`;
            case ActivityType.DeleteProject:
                return `deleted ${isProject(data) && data.title}`;
            case ActivityType.JoinProject:
                return `joined ${currentProject?.title}`;
            case ActivityType.LeaveProject:
                return `left ${isProject(data) && data.title}`;

            default:
                return '';
        }
    }, [currentProject, data]);

  return (
    <div
        className={twMerge(`
            w-full
            flex
            items-center
            gap-1
            p-2
        `)}
    >
        {imgSrc ? (
            <ImageWithFallback
                width={28}
                height={28}
                src={imgSrc}
                alt={firstName}
                className='rounded-full w-7 h-7'
            />
        ) : (
            <span
                className={twMerge(`
                    w-7
                    h-7
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    font-light
                    border
                    border-blue-400
                    bg-white
                    text-blue-400
                `)}
            >
                {userInitials(activity.user)}
            </span>
        )}

        <p className='pl-2'>
            <b className='font-semibold'>{firstName}</b>
            {" "}
            {renderText(type)}
        </p>

        <p className='whitespace-nowrap self-start text-stone-400 text-end grow'>
            {getHowLongAgo(createdAt)}
        </p>
    </div>
  )
}

export default ActivityItem;