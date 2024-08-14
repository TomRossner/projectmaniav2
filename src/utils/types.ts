import { IUser } from "@/store/auth/auth.slice";
import { IProject, IStage, ITask, TeamMember } from "@/store/projects/projects.slice";
import { ReactNode } from "react";

type ScrollDirection = 'next' | 'prev';

type Priority = 'low' | 'medium' | 'high';

type Tag = {
    tag: TagName;
    tagColor: string;
}

enum SocialLinks {
    Portfolio = "https://tomrossner.dev/",
    Github = "https://github.com/TomRossner/",
    LinkedIn = "https://linkedin.com/in/tom-rossner/",
}

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

type ScreenWidth = 540 | 640 | 768 | 1024 | 1280;

type Screen = {
    [key in ScreenSize]: ScreenWidth;
}

type TagName = 'feature' | 'bug' | 'ui' | 'hotfix' | 'backend';

type ExternalLink = {
    name: string;
    url: string;
}

type MenuItem = {
    text: string;
    action?: () => void;
    icon?: ReactNode;
    imageSrc?: Pick<IUser, "imgSrc"> & string;
    withCount?: boolean;
    count?: number;
}

type TOption = {
    text: string;
    disabled: boolean;
    icon?: ReactNode;
    isStageOpt?: boolean;
}

type Status = "completed" | "uncompleted";

type Order = "descending" | "ascending";

type Options = "Edit" | "Search" | "Filter" | "Delete" | "Activity log";

type StageOptions = {
    option: string;
    category?: string;
    multiSelect?: boolean;
    subOptions?: StageOptions[];
    icon?: ReactNode;
}

// For AxiosError inside error.response.data
type ErrorData = {
    error: string;
}

type Filter = {
    category: string;
    value: string;
}

type SelectedStage = Pick<IStage, "stageId" | "title">;

type Sender = Pick<IUser, "userId" | "firstName" | "lastName">;

type Recipient = Pick<IUser, "userId" | "firstName" | "lastName">;

type NotificationType = 'invitation' | 'message' | 'friendRequest' | 'default';

type NotificationData = Pick<IProject, "projectId" | "title"> | Pick<Message, "id" | "from" | "createdAt" | "isRead">;

type Message = {
    from: Sender;
    to: Pick<Recipient, "userId">;
    message: string;
    createdAt: Date;
    isRead: boolean;
    id: string;
    type: MessageType;
}

type MessageType = "message" | "media" | "audio";

type SubTask = Pick<ITask, "isDone" | "title"> & {subtaskId: string};

type SortOptionType = 'date' | 'assignee' | 'priority';

type SortOption = {
    type: SortOptionType;
    order: SortOrder;
    possibleOrder?: SortOrder[];
}

type SortOrder = 'ascending' | 'descending';

type NewSubTask = Pick<SubTask, "isDone" | "title"> & {subtaskId: string};

type NewStageData = Pick<IStage, "tasks" | "title" | "createdBy" | "projectId" | "lastUpdatedBy">;

enum ActivityType {
    // Tasks

    AddTask = 'task/add',
    UpdateTask = 'task/update',
    DeleteTask = 'task/delete',

    UpdatePriority = 'task_priority_update',

    AddTag = 'task_tag_add',
    UpdateTag = 'task_tag_update',
    DeleteTag = 'task_tag_delete',

    UpdateDueDate = 'task_due_date_update',

    AddDescription = 'task_description_add',
    UpdateDescription = 'task_description_update',
    DeleteDescription = 'task_description_delete',

    AddAssignee = 'task_assignee_add',
    UpdateAssignee = 'task_assignee_update',
    DeleteAssignee = 'task_assignee_delete',

    AddSubtask = 'task_subtask_add',
    UpdateSubtask = 'task_subtask_update',
    DeleteSubtask = 'task_subtask_delete',

    UpdateIsDone = 'task_is_done_update',

    AddExternalLink = 'task_external_link_add',
    UpdateExternalLink = 'task_external_link_update',
    DeleteExternalLink = 'task_external_link_delete',

    UpdateCurrentStage = 'current_stage/update',

    AddDependency = 'task_dependencies_add',
    UpdateDependency = 'task_dependencies_update',
    DeleteDependency = 'task_dependencies_delete',

    AddThumbnail = 'task_thumbnail_add',
    UpdateThumbnail = 'task_thumbnail_update',
    DeleteThumbnail = 'task_thumbnail_delete',

    UpdateTaskTitle = 'task_title_update',


    // Stages

    UpdateStageTitle = 'stage_title_update',

    AddStage = 'stage_add',
    DeleteStage = 'stage_delete',


    // Projects

    UpdateProjectTitle = 'project_title_update',

    CreateProject = 'project_create',
    DeleteProject = 'project_delete',
    JoinProject = 'project_join',
    LeaveProject = 'project_leave',
}

type ActivityData = ITask | IStage | IProject | TeamMember;

export type {
    ScrollDirection,
    Tag,
    Screen,
    ScreenSize,
    ScreenWidth,
    ExternalLink,
    TagName,
    StageOptions,
    Options,
    Priority,
    ErrorData,
    MenuItem,
    Filter,
    Status,
    TOption,
    SelectedStage,
    Sender,
    Recipient,  
    NotificationData,
    NotificationType,
    Message,
    MessageType,
    SubTask,
    SortOption,
    SortOptionType,
    SortOrder,
    NewSubTask,
    Order,
    NewStageData,
    ActivityData,
}

export {
    SocialLinks,
    ActivityType,
}