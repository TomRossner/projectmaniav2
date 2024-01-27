import { ILoginCredentials, IUserSignUpData } from "@/utils/interfaces";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = 'http://localhost:3001';

const signUp = async (userData: IUserSignUpData): Promise<AxiosResponse> => {
    const response = await axios.post('/auth/sign-up', userData);
    console.log(response);
    return response
}

const login = async (credentials: ILoginCredentials): Promise<AxiosResponse> => {
    return await axios.post('/auth/log-in', credentials);
}

const googleSignIn = async (email: string): Promise<AxiosResponse> => {
    const response = await axios.get(`/users/get-by-email?email=${encodeURIComponent(email)}`);
    console.log(response);
    return response;
}

export {
    signUp,
    login,
    googleSignIn
}