import { IProject, IStage, ITask, TeamMember } from "@/store/projects/projects.slice";
import { ExternalLink, NotificationData, NotificationType, Priority, SelectedStage, Sender, SubTask, Recipient, TagName, NewSubTask, ActivityType } from "./types";
import { IUser } from "@/store/auth/auth.slice";

interface IUserSignUpData extends ILoginCredentials {
    firstName: string;
    lastName: string;
    confirmPassword?: string;
}

interface ILoginCredentials {
    email: string;
    password: string;
}


// Forms interfaces

interface IPasswordRegExp {
    MIN_LENGTH: number;
    LOWERCASE: RegExp;
    UPPERCASE: RegExp;
    DIGIT: RegExp;
    SPECIAL_CHAR: RegExp;
}

interface NewTaskData {
    title: string;
    dueDate: string;
    priority: Priority;
    isDone: boolean;
    currentStage?: SelectedStage;
    description?: string;
    thumbnailSrc?: string;
    externalLinks: ExternalLink[];
    tags: TagName[];
    assignees: string[];
    subtasks: NewSubTask[];
    createdBy: string;
    dependencies: string[];
    projectId: string;
    lastUpdatedBy: string;
}

interface NewInvitationData {
    projectData: Pick<IProject, "projectId" | "title">;
    sender: Sender;
    recipient: Recipient;
}

interface Invitation extends NewInvitationData {
    isPending: boolean;
    createdAt: Date;
    id: string;
}

interface INotification extends NewNotificationData {
    notificationId: string;
    createdAt: Date;
    isSeen: boolean;
}

interface NewNotificationData {
    type: NotificationType;
    sender: Sender;
    recipient: Recipient;
    data: NotificationData;
}

interface NewActivityData {
    user: TeamMember;
    type: ActivityType;
    data: ITask | IStage | IProject | TeamMember;
    projectId: string;
}

interface Activity extends NewActivityData {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    activityId: string;
}

export type {
    ILoginCredentials,
    IPasswordRegExp,
    IUserSignUpData,
    NewTaskData,
    NewInvitationData,
    Invitation,
    NewNotificationData,
    INotification,
    NewActivityData,
    Activity,
}