import { IStage, TPriority } from "@/store/projects/projects.slice";

interface IUserData {
    email: string;
    firstName: string;
    lastName: string;

    imgUrl?: string;
    id?: string;
    createdAt?: Date;
    online?: boolean;
    contacts?: string[];
}

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
    priority: TPriority;
    isDone: boolean;
    currentStage?: Partial<IStage>;
    description?: string;
    imgSrc?: string;
}

export type {
    IUserData,
    ILoginCredentials,
    IPasswordRegExp,
    IUserSignUpData,
    IBaseTask
}