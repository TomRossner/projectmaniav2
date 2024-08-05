import { IProject, IStage } from "@/store/projects/projects.slice";
import { NewTaskData } from "./interfaces";
import { Tag, ScrollDirection, Screen, ExternalLink, StageOptions, Priority, NewStageData } from "./types";
import { TooltipProps } from "@greguintow/react-tippy";
import { capitalizeFirstLetter } from "./utils";

const APP_VERSION_FULL: string = process.env.NEXT_PUBLIC_APP_VERSION as string;

const APP_VERSION: string = APP_VERSION_FULL.split(".")[0];

const DEFAULT_STAGE: Pick<NewStageData, "title" | "tasks"> = {
    tasks: [],
    title: 'New Stage'
}

const DEFAULT_TASK_TITLE: string = 'New task';

const PRIORITIES: Priority[] = [
    "low",
    "medium",
    "high"
]

const DEFAULT_PRIORITY: Priority = "low";

const DEFAULT_TASK_VALUES: NewTaskData = {
    title: DEFAULT_TASK_TITLE,
    dueDate: new Date(Date.now()).toJSON(),
    description: "",
    priority: DEFAULT_PRIORITY as Priority,
    isDone: false,
    thumbnailSrc: "",
    externalLinks: [],
    tags: [],
    assignees: [],
    subtasks: [],
    createdBy: "",
    dependencies: [],
    projectId: "",
    lastUpdatedBy: "",
}

const SCROLL_DIRECTIONS: ScrollDirection[] = ['next', 'prev'];

const DEFAULT_PROJECT_TITLE: string = 'New project';

const DEFAULT_PROJECT: Pick<IProject, "title" | "stages" | "team" | "createdBy" | "activities" | "lastUpdatedBy"> = {
    title: DEFAULT_PROJECT_TITLE,
    stages: [],
    team: [],
    activities: [],
    createdBy: "",
    lastUpdatedBy: "",
}

const TAGS: Tag[] = [
    {
        tag: "bug",
        tagColor: "bg-yellow-400 border-yellow-600",
    },
    {
        tag: "feature",
        tagColor: "bg-violet-400 border-violet-600",
    },
    {
        tag: "ui",
        tagColor: "bg-teal-400 border-teal-600",
    },
    {
        tag: "hotfix",
        tagColor: "bg-orange-400 border-orange-600",
    },
    {
        tag: "backend",
        tagColor: "bg-sky-400 border-sky-600",
    },
]

const TASK_MENU_OPTIONS: string[] = [
    'Done',
    'Edit',
    'Delete'
]

const PROJECT_MENU_OPTIONS: string[] = [
    'Edit',
    'Invite',
    'Activity log',
    'Leave project',
    'Delete',
]

const FILTERS_CATEGORIES = {
    "Priority": "Priority",
    "Tag": "Tag",
    "Status": "Status",
    "Date": "Date",
    "Assignee": "Assignee",
}

const STAGE_MENU: StageOptions[] = [
    {
        option: "Edit",
    },
    {
        option: "Filter",
        subOptions: [
            {
                option: "Priority",
                multiSelect: true,
                subOptions: [
                    ...PRIORITIES.map(p => (
                        {
                            option: capitalizeFirstLetter(p),
                            category: FILTERS_CATEGORIES["Priority"]
                        }
                    ))
                ]
            },
            {
                option: "Tag",
                multiSelect: true,
                subOptions: [
                    ...TAGS.map(t => (
                        {
                            option: capitalizeFirstLetter(t.tag),
                            category: FILTERS_CATEGORIES["Tag"]
                        }
                    ))
                ]
            },
            {
                option: "Status",
                subOptions: [
                    {
                        option: "Completed",
                        category: FILTERS_CATEGORIES["Status"]
                    },
                    {
                        option: "Uncompleted",
                        category: FILTERS_CATEGORIES["Status"]
                    },
                ]
            },
            // {
            //     option: "Date",
            //     subOptions: [
            //         {
            //             option: "Ascending",
            //             category: FILTERS_CATEGORIES["Date"]
            //         },
            //         {
            //             option: "Descending",
            //             category: FILTERS_CATEGORIES["Date"]
            //         },
            //     ]
            // },
            {
                option: "Assignee",
                subOptions: []
            },
        ]
    },
    {
        option: "Search",
    },
    {
        option: "Delete",
    },
]
const STAGE_MENU_OPTIONS: string[] = [
    'Sort',
    'Filter',
    // 'Search',
    'Edit',
    'Delete',
]

const DEFAULT_EXTERNAL_LINK: ExternalLink = {
    name: 'Link #1',
    url: ''
}

const MAX_EXTERNAL_LINKS: number = 10;

const DEFAULT_TOOLTIP_PROPS: TooltipProps = {
    arrow: true,
    position: 'top',
    animation: 'scale',
    duration: 150,
    disabled: false,
    theme: 'dark',
    inertia: true,
}

const SCREENS: Screen = {
    "xs": 540,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
}

// Count for team members shown in homepage for mostRecentProject
const TEAM_MEMBERS_COUNT = 3;

const PRIORITY_ORDER = {
    "low": 1,
    "medium": 2,
    "high": 3
}

const MAX_SUBTASKS: number = 10;

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
    TASK_MENU_OPTIONS,
    DEFAULT_EXTERNAL_LINK,
    MAX_EXTERNAL_LINKS,
    TAGS,
    DEFAULT_TOOLTIP_PROPS,
    SCREENS,
    PROJECT_MENU_OPTIONS,
    STAGE_MENU_OPTIONS,
    FILTERS_CATEGORIES,
    STAGE_MENU,
    TEAM_MEMBERS_COUNT,
    PRIORITY_ORDER,
    MAX_SUBTASKS,
}