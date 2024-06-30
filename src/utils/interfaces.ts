import { IProject, IStage } from "@/store/projects/projects.slice";
import { ExternalLink, NotificationData, NotificationType, Priority, SelectedStage, Sender, Subject, TagName } from "./types";

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

interface IBaseTask {
    title: string;
    dueDate: string;
    priority: Priority;
    isDone: boolean;
    currentStage?: SelectedStage;
    description?: string;
    thumbnailSrc?: string;
    externalLinks?: ExternalLink[];
    tags: TagName[];
    // attachedFiles: Media[];
}

interface NewInvitationData {
    projectData: Pick<IProject, "projectId" | "title">;
    sender: Sender;
    subject: Subject;
}

interface Invitation extends NewInvitationData {
    isPending: boolean;
    createdAt: Date;
    id: string;
}

interface INotification extends NewNotificationData {
    id: string;
    createdAt: Date;
    isSeen: boolean;
}

interface NewNotificationData {
    type: NotificationType;
    sender: Sender;
    subject: Subject;
    data: NotificationData;
}

export type {
    ILoginCredentials,
    IPasswordRegExp,
    IUserSignUpData,
    IBaseTask,
    NewInvitationData,
    Invitation,
    NewNotificationData,
    INotification,
}