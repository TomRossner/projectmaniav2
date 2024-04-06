import { createProject, getAllProjects } from "@/services/projects.api";
import { IBaseTask } from "@/utils/interfaces";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IProject extends IBaseProject {
    stages: IStage[];
    projectId: string;
    subtitle?: string;
    team: ITeamMember[];
}

export interface IBaseProject {
    title: string,
    team: ITeamMember[];
}

export interface ITeamMember {
    email: string;
    userId: string;
    firstName: string;
    lastName: string;
    imgSrc: string;
}

export interface IStage {
    title: string;
    tasks: ITask[];
    stageId?: string;
}

export interface ITask extends IBaseTask {
    taskId: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface IProjectsState {
    projects: IProject[];
    currentProject: IProject | null;
    isFetching: boolean;
    currentStage: IStage | null;
    currentTask: ITask | null;
    stages: IStage[];
    tasks: ITask[];
    currentStageIndex: number;
}

const initialState: IProjectsState = {
    projects: [],
    currentProject: null,
    isFetching: false,
    currentStage: null,
    currentTask: null,
    stages: [],
    tasks: [],
    currentStageIndex: 0,
}

const handleError = (error: any) => {
    if (error.response) {
        const {response: {data: {error: errorMsg}}} = error;
        throw errorMsg;
    } else throw error;
}

export const fetchProjectsAsync = createAsyncThunk('projectsSlice/fetchProjectsAsync', async (userId: string) => {
    try {
        const {data} = await getAllProjects(userId);
        return data;
    } catch (error: any) {
        handleError(error);   
    }
})

export const createProjectAsync = createAsyncThunk('projectsSlice/createProjectAsync', async (newProjectData: Partial<IProject>) => {
    try {
        const {data} = await createProject(newProjectData);
        console.log({data});
        return data; 
    } catch (error: any) {
        handleError(error);
    }
})

export const projectsSlice = createSlice({
    name: 'projectsSlice',
    initialState,
    reducers: {
        setProjects: (state, action: PayloadAction<IProject[]>) => {
            state.projects = action.payload;
        },
        setCurrentProject: (state, action: PayloadAction<IProject | null>) => {
            state.currentProject = action.payload;
        },
        setCurrentStage: (state, action: PayloadAction<IStage | null>) => {
            state.currentStage = action.payload;
        },
        setCurrentTask: (state, action: PayloadAction<ITask | null>) => {
            state.currentTask = action.payload;
        },
        setIsFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload;
        },
        setStages: (state, action: PayloadAction<IStage[]>) => {
            state.stages = action.payload;
        },
        setTasks: (state, action: PayloadAction<ITask[]>) => {
            state.tasks = action.payload;
        },
        setCurrentStageIndex: (state, action: PayloadAction<number>) => {
            state.currentStageIndex = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectsAsync.fulfilled, (state: IProjectsState, action: PayloadAction<IProject[]>) => {
                state.projects = action.payload;
                state.isFetching = false;
            })
            .addCase(fetchProjectsAsync.pending, (state: IProjectsState) => {
                state.isFetching = true;
            })
            .addCase(fetchProjectsAsync.rejected, (state: IProjectsState) => {
                state.isFetching = false;
            })
    }
})

export const {
    setProjects,
    setCurrentProject,
    setCurrentStage,
    setCurrentTask,
    setIsFetching,
    setStages,
    setTasks,
    setCurrentStageIndex
} = projectsSlice.actions;