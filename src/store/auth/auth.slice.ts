import { login, logout } from "@/services/auth.api";
import { LoginCredentials } from "@/utils/interfaces";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProject } from "../projects/projects.slice";
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "@/utils/types";
import { updateUserData } from "@/services/user.api";

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
    authProvider: AuthProvider;
}

export interface AuthState {
    user: User;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
}

export type User = (IUser & {
    socketId: string;
    updatedAt: string;
}) | null;

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    authError: null
}

export const fetchUserAsync = createAsyncThunk('authSlice/fetchUserAsync', async (credentials: LoginCredentials, {rejectWithValue}) => {
    try {
        const res = await login(credentials);

        if (res.data.accessToken) {
            const decodedUser = jwtDecode<User>(res.data.accessToken);
            return decodedUser;
        }

        return res.data;
        
    } catch (error: any) {
        if (error.response) {
            const {response: {data: errorMsg}} = error;
            console.log("fetchUser error: ", errorMsg)

            return rejectWithValue(errorMsg);
        } else throw error;
    } 
})

export const updateUserAsync = createAsyncThunk('authSlice/updateUserAsync', async (user: IUser, {rejectWithValue}) => {
    try {
        const res = await updateUserData(user);

        // if (res.data.accessToken) {
        //     const decodedUser = jwtDecode<User>(res.data.accessToken);
        //     return decodedUser;
        // }
        
        return res.data;
        
    } catch (error: any) {
        if (error.response) {
            const {response: {data: {error: errorMsg}}} = error;

            return rejectWithValue(errorMsg);
        } else throw error;
    } 
})

export const logoutUser = createAsyncThunk('authSlice/logoutUser', async (_, {rejectWithValue}) => {
    try {
        await logout();
        return;
    } catch (error: any) {
        if (error.response) {
            const {response: {data: {error: errorMsg}}} = error;

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
    },
    extraReducers: (builder) => {
        builder
            // Fetch user
            .addCase(fetchUserAsync.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload !== null;
            })
            .addCase(fetchUserAsync.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(fetchUserAsync.rejected, (state: AuthState, action) => {
                state.authError = "Invalid email or password";
            })

            // Update user
            .addCase(updateUserAsync.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateUserAsync.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(updateUserAsync.rejected, (state: AuthState, action) => {
                state.authError = "Failed updating user";
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            })
            .addCase(logoutUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.authError = typeof action.payload === 'string'
                    ? action.payload
                    : 'Logout failed';
            })
    }
})

export const {
    setUser,
    setIsAuthenticated,
    setAuthError,
    setIsLoading,
} = authSlice.actions;