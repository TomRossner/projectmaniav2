import { RootState } from "../store";
import { IAuthState, TUser } from "./auth.slice";

export const selectAuth = (state: RootState): IAuthState => state.auth;

export const selectUser = (state: RootState): TUser => state.auth.user;

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectIsLoading = (state: RootState): boolean => state.auth.isLoading;

export const selectAuthError = (state: RootState): string | null => state.auth.authError;