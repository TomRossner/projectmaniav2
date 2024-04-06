import { IStage, Priority } from "@/store/projects/projects.slice";
import { TLabel } from "./types";

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
    currentStage?: Partial<IStage>;
    description?: string;
    imgSrc?: string;
    externalLinks?: IExternalLink[];
    labels: TLabel[];
}

interface IExternalLink {
    name: string;
    url: string;
}

export type {
    ILoginCredentials,
    IPasswordRegExp,
    IUserSignUpData,
    IBaseTask,
    IExternalLink
}