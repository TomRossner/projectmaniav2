import { getActivityLog } from "@/services/activity.api";
import { Activity } from "@/utils/interfaces";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActivityState {
    activities: Activity[];
    isLoading: boolean;
}

const initialState: ActivityState = {
    activities: [],
    isLoading: false,
}

export const fetchActivityLogAsync = createAsyncThunk('activityLogSlice/fetchActivityLogAsync', async (projectId: string, {rejectWithValue}) => {
    try {
        const res = await getActivityLog(projectId);

        return res.data;
    } catch (error: any) {
        if (error.response) {
            const {response: {data: {error: errorMsg}}} = error;
            
            console.log("Reject with value");
            return rejectWithValue(errorMsg);
        } else throw error;
    } 
})

export const activityLogSlice = createSlice({
    initialState,
    name: 'activityLogSlice',
    reducers: {
        setActivities: (state, action: PayloadAction<Activity[]>) => {
            state.activities = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogAsync.fulfilled, (state: ActivityState, action: PayloadAction<Activity[]>) => {
                state.isLoading = false;
                state.activities = action.payload;
            })
            .addCase(fetchActivityLogAsync.pending, (state: ActivityState) => {
                state.isLoading = true;
            })
            .addCase(fetchActivityLogAsync.rejected, (state: ActivityState, action) => {
                console.log("Rejected: ", action);
                state.activities = [];
                state.isLoading = false;
            })
    }
});

export const {
    setActivities
} = activityLogSlice.actions;