import { getActivityLog } from "@/services/activity.api";
import { DEFAULT_PAGE } from "@/utils/constants";
import { Activity } from "@/utils/interfaces";
import { PaginationResponse } from "@/utils/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActivityState {
    activities: Activity[];
    isLoading: boolean;
    page: number;
    totalPages: number | null;
}

const initialState: ActivityState = {
    activities: [],
    isLoading: false,
    page: DEFAULT_PAGE,
    totalPages: null,
}

export type FetchActivitiesParams = {
    projectId: string;
    page: number;
    limit: number
}

export const fetchActivityLogAsync = createAsyncThunk('activityLogSlice/fetchActivityLogAsync', async ({projectId, page, limit}: FetchActivitiesParams, {rejectWithValue}) => {
    try {
        const res = await getActivityLog(projectId, page, limit);

        return res.data;
    } catch (error: any) {
        console.error(error);
        throw error;
    } 
})

export const activityLogSlice = createSlice({
    initialState,
    name: 'activityLogSlice',
    reducers: {
        setActivities: (state, action: PayloadAction<Activity[]>) => {
            state.activities = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogAsync.fulfilled, (state: ActivityState, action: PayloadAction<PaginationResponse>) => {
                state.isLoading = false;
                state.activities = state.activities.concat(action.payload.results);
                state.page = action.payload.hasNextPage ? action.payload.nextPage as number : state.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchActivityLogAsync.pending, (state: ActivityState) => {
                state.isLoading = true;
            })
            .addCase(fetchActivityLogAsync.rejected, (state: ActivityState, action) => {
                console.log("Rejected: ", action);
                state.activities = state.activities;
                state.isLoading = false;
            })
    }
});

export const {
    setActivities,
    setPage,
} = activityLogSlice.actions;