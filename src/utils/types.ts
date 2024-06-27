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
    imageSrc?: Pick<IUser, "thumbnailSrc"> & string;
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

type Invitation = {
    isPending: boolean;
    projectData: Pick<IProject, "projectId" | "title">;
    createdAt: Date;
    id: string;
    sender: MessageSender;
    subject: MessageSubject;
}

type MessageSender = Pick<IUser, "userId" | "firstName" | "lastName">;

type MessageSubject = Pick<IUser, "userId" | "firstName" | "lastName">;

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
    MessageSender,
    MessageSubject,
    Invitation,
    
}

export {
    SocialLinks
}