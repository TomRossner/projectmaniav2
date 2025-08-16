import { createProject, getAllUserProjects, getProject, getProjectsPaginated, updateProject } from "@/services/projects.api";
import { Activity, NewTaskData } from "@/utils/interfaces";
import { ErrorData, Filter, PaginationResponse } from "@/utils/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IUser } from "../auth/auth.slice";
import { DEFAULT_PAGE } from "@/utils/constants";

export interface IProject extends NewProjectData {
    stages: IStage[];
    projectId: string;
    subtitle?: string;
    team: TeamMember[];
    activities: Activity[];
}

export interface NewProjectData {
    title: string,
    team: TeamMember[];
    createdBy: string;
    stages: IStage[];
    activities: Activity[];
    lastUpdatedBy: string;
}

export type TeamMember = Pick<IUser, "email" | "userId" | "firstName" | "lastName" |"imgSrc" | "isOnline">;

export interface IStage {
    title: string;
    tasks: ITask[];
    stageId: string;
    projectId: string;
    createdBy: string;
    lastUpdatedBy: string;
}

export interface ITask extends NewTaskData {
    createdAt: Date;
    updatedAt: Date;
    taskId: string;
}

export interface ProjectsState {
    projects: IProject[];
    currentProject: IProject | null;
    isFetching: boolean;
    currentStage: IStage | null;
    currentTask: ITask | null;
    stages: IStage[];
    tasks: ITask[];
    currentStageIndex: number;
    filters: Filter[];
    isJoiningProject: boolean;
    isLeavingProject: boolean;
    page: number;
    totalPages: number | null;
}

const initialState: ProjectsState = {
    projects: [],
    currentProject: null,
    isFetching: false,
    currentStage: null,
    currentTask: null,
    stages: [],
    tasks: [],
    currentStageIndex: 0,
    filters: [],
    isJoiningProject: false,
    isLeavingProject: false,
    page: DEFAULT_PAGE,
    totalPages: null,
}

const handleError = (error: AxiosError<ErrorData>) => {
    if (error.response) {
        const {
            response: {
                data: {
                    error: errorMsg
                }
            }
        } = error;
        
        throw errorMsg;
    } else throw error;
}

type FetchPaginatedProjectsParams = {
    userId: string;
    page: number;
    limit?: number;
}

export const fetchPaginatedProjectsAsync = createAsyncThunk('projectsSlice/fetchPaginatedProjectsAsync', async ({userId, page, limit}: FetchPaginatedProjectsParams) => {
    if (!userId) return;

    try {
        const {data: paginationResponse} = await getProjectsPaginated(userId, page, limit);

        console.log(paginationResponse);
        return paginationResponse as PaginationResponse;
    } catch (error) {
        console.error(error);
        throw 'We were unable to find your projects. Please try again later';
        // handleError(error as AxiosError<ErrorData>);
    }
})

export const fetchAllProjectsAsync = createAsyncThunk('projectsSlice/fetchAllProjectsAsync', async (userId: string) => {
    if (!userId) return;

    try {
        const {data: projects} = await getAllUserProjects(userId);

        console.log(projects);
        return projects;
    } catch (error) {
        console.error(error);
        throw 'We were unable to find your projects. Please try again later';
        // handleError(error as AxiosError<ErrorData>);
    }
})

export const updateProjectAsync = createAsyncThunk('projectsSlice/updateProjectAsync', async (project: IProject) => {
    if (!project) return;

    try {
        const response = await updateProject(project);
        console.log("Updated project data", response.data)
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
})

export const createProjectAsync = createAsyncThunk('projectsSlice/createProjectAsync', async (newProjectData: NewProjectData) => {
    try {
        const {data} = await createProject(newProjectData);
        return data; 
    } catch (error) {
        handleError(error as AxiosError<ErrorData>);
    }
})

type JoinProjectData = {
    projectData: Pick<IProject, "projectId" | "title">;
    user: IUser;
}

export const joinProjectAsync = createAsyncThunk('/projectsSlice/joinProjectAsync', async ({
    projectData,
    user,
}: JoinProjectData) => {
    try {
        const res = await getProject(projectData.projectId);

        if (res.data) {
            const project: IProject = res.data;

            const newTeamMember = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imgSrc: user.imgSrc,
                userId: user.userId,
            } as TeamMember;

            const updatedProject = {
                ...project,
                team: [
                    // Remove user if present and then add the new one, for updated values(imgSrc?)
                    ...project.team.filter(u => u.userId !== user?.userId),
                    newTeamMember
                ],
            } as IProject;
            
            const response = await updateProject(updatedProject);

            if (response.status !== 200) {
                throw 'Failed updating project';
            }

            return response.data;
        //   await handleRemoveNotification(notificationId);
        }
    } catch (error) {
        console.error(error);
        handleError(error as AxiosError<ErrorData>);
    }
})

type LeaveProjectData = {
    userId: string;
    projectId: string;
}

export const leaveProjectAsync = createAsyncThunk('/projectsSlice/leaveProjectAsync', async ({userId, projectId}: LeaveProjectData) => {
    try {
        const res = await getProject(projectId);

        if (res.data) {
            const project: IProject = res.data;
            
            const updatedProject: IProject = {
                ...project,
                team: [
                    ...project.team.filter(u => u.userId !== userId)
                ]
            }

            const response = await updateProject(updatedProject);

            if (response.status !== 200) {
                throw 'Failed updating project';
            }

            return response.data;
        }
      
    } catch (error: unknown) {
      handleError(error as AxiosError<ErrorData>);
    }
});

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
        setFilters: (state, action: PayloadAction<Filter[]>) => {
            state.filters = action.payload;
        } 
    },
    extraReducers: (builder) => {
        builder

            // Fetch paginated
            .addCase(fetchPaginatedProjectsAsync.fulfilled, (state: ProjectsState, action: PayloadAction<PaginationResponse | undefined>) => {
                state.projects = state.projects.concat(action.payload!.results);
                state.isFetching = false;
                state.page = action.payload!.nextPage ?? state.page;
                state.totalPages = action.payload!.totalPages;
            })
            .addCase(fetchPaginatedProjectsAsync.pending, (state: ProjectsState) => {
                state.isFetching = true;
            })
            .addCase(fetchPaginatedProjectsAsync.rejected, (state: ProjectsState) => {
                state.isFetching = false;
            })

            // Fetch all
            .addCase(fetchAllProjectsAsync.fulfilled, (state: ProjectsState, action: PayloadAction<IProject[]>) => {
                state.projects = action.payload;
                state.isFetching = false;
            })
            .addCase(fetchAllProjectsAsync.pending, (state: ProjectsState) => {
                state.isFetching = true;
            })
            .addCase(fetchAllProjectsAsync.rejected, (state: ProjectsState) => {
                state.isFetching = false;
            })

            // Update project
            .addCase(updateProjectAsync.fulfilled, (state: ProjectsState, action: PayloadAction<IProject>) => {
                state.isFetching = false;
            })
            .addCase(updateProjectAsync.pending, (state: ProjectsState) => {
                state.isFetching = true;
            })
            .addCase(updateProjectAsync.rejected, (state: ProjectsState) => {
                state.isFetching = false;
            })

            // Join project
            .addCase(joinProjectAsync.fulfilled, (state: ProjectsState) => {
                state.isJoiningProject = false;
            })
            .addCase(joinProjectAsync.rejected, (state: ProjectsState) => {
                state.isJoiningProject = false;
            })
            .addCase(joinProjectAsync.pending, (state: ProjectsState) => {
                state.isJoiningProject = true;
            })

            // Leave project
            .addCase(leaveProjectAsync.fulfilled, (state: ProjectsState) => {
                state.isLeavingProject = false;
            })
            .addCase(leaveProjectAsync.rejected, (state: ProjectsState) => {
                state.isLeavingProject = false;
            })
            .addCase(leaveProjectAsync.pending, (state: ProjectsState) => {
                state.isLeavingProject = true;
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
    setCurrentStageIndex,
    setFilters,
} = projectsSlice.actions;