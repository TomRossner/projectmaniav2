import { Activity } from "@/utils/interfaces";
import { RootState } from "../store";

export const selectActivities = (state: RootState): Activity[] => state.activityLog.activities;

export const selectIsLoading = (state: RootState): boolean => state.activityLog.isLoading;

export const selectPage = (state: RootState): number => state.activityLog.page;

export const selectTotalPages = (state: RootState): number | null => state.activityLog.totalPages;