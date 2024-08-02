import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Error {
    errorMsg: string | null;
}

const initialState: Error = {
    errorMsg: null
}

export const errorSlice = createSlice({
    initialState,
    name: 'errorSlice',
    reducers: {
        setErrorMsg: (state, action: PayloadAction<string | null>) => {
            state.errorMsg = action.payload;
        }
    }
});

export const {
    setErrorMsg
} = errorSlice.actions;