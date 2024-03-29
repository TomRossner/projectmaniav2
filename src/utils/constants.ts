import { IProject, IStage, TPriority } from "@/store/projects/projects.slice";
import { IBaseTask } from "./interfaces";
import { TScrollDirection } from "./types";

const APP_VERSION_FULL: string = process.env.NEXT_PUBLIC_APP_VERSION as string;

const APP_VERSION: string = APP_VERSION_FULL.split(".")[0];

const DEFAULT_STAGE: IStage = {
    tasks: [],
    title: 'Stage #1'
}

const DEFAULT_TASK_TITLE: string = 'New task';

const PRIORITIES: TPriority[] = [
    "low",
    "medium",
    "high"
]

const DEFAULT_PRIORITY: TPriority = "low";

const DEFAULT_TASK_VALUES: IBaseTask = {
    title: DEFAULT_TASK_TITLE,
    dueDate: new Date(Date.now()).toJSON(),
    description: '',
    priority: DEFAULT_PRIORITY as TPriority,
    isDone: false,
    imgSrc: ''
}

const SCROLL_DIRECTIONS: TScrollDirection[] = ['next', "prev"];

const DEFAULT_PROJECT_TITLE: string = 'New project';

const DEFAULT_PROJECT: Partial<IProject> = {
    title: DEFAULT_PROJECT_TITLE,
    stages: [DEFAULT_STAGE],
    team: []
}

const TASK_MENU_OPTIONS: string[] = [
    'Edit',
    'Delete'
]

export {
    APP_VERSION,
    APP_VERSION_FULL,
    DEFAULT_STAGE,
    DEFAULT_TASK_TITLE,
    PRIORITIES,
    DEFAULT_PRIORITY,
    DEFAULT_TASK_VALUES,
    SCROLL_DIRECTIONS,
    DEFAULT_PROJECT_TITLE,
    DEFAULT_PROJECT,
    TASK_MENU_OPTIONS
}