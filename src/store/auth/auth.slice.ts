import { login } from "@/services/auth.api";
import { saveJwt } from "@/services/localStorage";
import { ILoginCredentials } from "@/utils/interfaces";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProject } from "../projects/projects.slice";
import { jwtDecode } from "jwt-decode";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
    imgSrc: string;
    createdAt: Date;
    isOnline: boolean;
    contacts: string[];
    mostRecentProject?: Pick<IProject, "projectId" | "title"> | null;
    notifications: string[];
}

export interface AuthState {
    user: User;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
}

export type User = (IUser & {
    _id: string;
    __v: number;
    iat: number;
    session: string;
    exp: number;
    socketId: string;
    updatedAt: string;
}) | null;

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    authError: null
}

export const fetchUserAsync = createAsyncThunk('authSlice/fetchUserAsync', async (credentials: ILoginCredentials, {rejectWithValue}) => {
    try {
        const res = await login(credentials);
        console.log(res.data);

        if (res.data.accessToken) {
            const decodedUser = jwtDecode<User>(res.data.accessToken);
            return decodedUser;
        }

        return res.data;
        
    } catch (error: any) {
        console.log("fetchUserAsync error: ", error);
        if (error.response) {
            const {response: {data: {error: errorMsg}}} = error;
            
            console.log("Reject with value");
            return rejectWithValue(errorMsg);
        } else throw error;
    } 
})

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload ? true : false;
        },
        
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        
        setAuthError: (state, action: PayloadAction<string | null>) => {
            state.authError = action.payload;
        },

        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserAsync.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
                state.isLoading = false;
                // saveJwt(action.payload);
                state.isAuthenticated = action.payload !== null;
                console.log(action);
            })
            .addCase(fetchUserAsync.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(fetchUserAsync.rejected, (state: AuthState, action) => {
                console.log("Rejected: ", action);
                state.authError = "Invalid email or password";
            })
    }
})

export const {
    setUser,
    setIsAuthenticated,
    setAuthError,
    setIsLoading,
    logout
} = authSlice.actions;