import { login } from "@/services/auth.api";
import { saveJwt } from "@/services/localStorage";
import { ILoginCredentials } from "@/utils/interfaces";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProject } from "../projects/projects.slice";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    userId?: string;
    imgUrl?: string;
    createdAt?: Date;
    isOnline?: boolean;
    contacts?: string[];
    mostRecentProject?: Partial<IProject> | null;
}

export interface IAuthState {
    user: TUser;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
}

export type TUser = IUser | null;

const initialState: IAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    authError: null
}

export const fetchUserAsync = createAsyncThunk('authSlice/fetchUserAsync', async (credentials: ILoginCredentials) => {
    try {
        const {data: {token}} = await login(credentials);
        return token;
    } catch (error: any) {
        if (error.response) {
            const {response: {data: {error: errorMsg}}} = error;
            throw errorMsg;
        } else throw error;
    } 
})

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TUser>) => {
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
            .addCase(fetchUserAsync.fulfilled, (state: IAuthState, action: PayloadAction<string>) => {
                state.isLoading = false;
                saveJwt(action.payload);
            })
            .addCase(fetchUserAsync.pending, (state: IAuthState) => {
                state.isLoading = true;
            });
    }
})

export const {
    setUser,
    setIsAuthenticated,
    setAuthError,
    setIsLoading,
    logout
} = authSlice.actions;