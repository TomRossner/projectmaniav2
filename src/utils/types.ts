import { IUser } from "@/store/auth/auth.slice";
import { IStage } from "@/store/projects/projects.slice";
import { ReactNode } from "react";

type ScrollDirection = 'next' | 'prev';

type Priority = 'low' | 'medium' | 'high';

type Tag = {
    tag: TagName;
    tagColor: string;
}

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

type ScreenWidth = 540 | 640 | 768 | 1024 | 1280;

type Screen = {
    [key in ScreenSize]: ScreenWidth;
}

type TagName = 'feature' | 'bug' | 'ui' | 'hotfix';

type ExternalLink = {
    name: string;
    url: string;
}

type MenuItem = {
    text: string;
    action: () => void;
    icon?: ReactNode;
    imageSrc?: Partial<IUser> & string;
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
    SelectedStage
}