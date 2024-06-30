import { IUser } from "@/store/auth/auth.slice";
import { IProject, IStage } from "@/store/projects/projects.slice";
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

type Subject = Pick<IUser, "userId" | "firstName" | "lastName">;

type NotificationType = 'invitation' | 'message' | 'friendRequest' | 'joinedProject';

type NotificationData = Pick<IProject, "projectId" | "title"> | Pick<Message, "id" | "from" | "createdAt" | "isRead">;

type Message = {
    from: Pick<IUser, "userId" | "firstName" | "lastName">;
    to: Pick<IUser, "userId">;
    message: string;
    createdAt: Date;
    isRead: boolean;
    id: string;
}

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
    Subject,  
    NotificationData,
    NotificationType, 
}

export {
    SocialLinks
}