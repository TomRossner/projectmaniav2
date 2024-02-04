import { ILoginCredentials, IUserSignUpData } from "@/utils/interfaces";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = 'http://localhost:3001';

const signUp = async (userData: IUserSignUpData): Promise<AxiosResponse> =>
    await axios.post('/auth/sign-up', userData);

const login = async (credentials: ILoginCredentials): Promise<AxiosResponse> =>
    await axios.post('/auth/log-in', credentials);

const googleSignIn = async (email: string): Promise<AxiosResponse> =>
    await axios.get(`/users/get-by-email?email=${encodeURIComponent(email)}`);

export {
    signUp,
    login,
    googleSignIn
}