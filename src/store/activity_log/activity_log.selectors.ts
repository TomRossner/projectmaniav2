import { Activity } from "@/utils/interfaces";
import { RootState } from "../store";

export const selectActivities = (state: RootState): Activity[] => state.activityLog.activities;

export const selectIsLoading = (state: RootState): boolean => state.activityLog.isLoading;