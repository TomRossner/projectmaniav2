import { Filter } from "@/utils/types";
import { RootState } from "../store";
import { IProject, IProjectsState, IStage, ITask } from "./projects.slice";

export const selectProjectsSlice = (state: RootState): IProjectsState => state.projects;

export const selectProjects = (state: RootState): IProject[] => state.projects.projects;

export const selectCurrentProject = (state: RootState): IProject | null => state.projects.currentProject;

export const selectCurrentStage = (state: RootState): IStage | null => state.projects.currentStage;

export const selectCurrentTask = (state: RootState): ITask | null => state.projects.currentTask;

export const selectIsFetching = (state: RootState): boolean => state.projects.isFetching;

export const selectStages = (state: RootState): IStage[] => state.projects.stages;

export const selectTasks = (state: RootState): ITask[] => state.projects.tasks;

export const selectCurrentStageIndex = (state: RootState): number => state.projects.currentStageIndex;

export const selectFilters = (state: RootState): Filter[] => state.projects.filters;