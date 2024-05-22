import { IStage } from "@/store/projects/projects.slice";
import { ExternalLink, Priority, SelectedStage, TagName } from "./types";

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

export type {
    ILoginCredentials,
    IPasswordRegExp,
    IUserSignUpData,
    IBaseTask,
}