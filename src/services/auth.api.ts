import { ILoginCredentials, IUserSignUpData } from "@/utils/interfaces";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const signUp = async (userData: IUserSignUpData): Promise<AxiosResponse> =>
    await axios.post('/auth/sign-up', userData);

const login = async (credentials: ILoginCredentials): Promise<AxiosResponse> =>
    await axios.post('/sessions', credentials, {withCredentials: true});

const googleSignIn = async (email: string): Promise<AxiosResponse> =>
    await axios.get(`/users/get-by-email?email=${encodeURIComponent(email)}`);

const fetchSession = async () => {
    try {
        const {data} = await axios.get('/users/me', {withCredentials: true});
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteSession = async () => {
    const response = await axios.delete(`/sessions`);
    console.log(response);
    return response;
}

export {
    signUp,
    login,
    googleSignIn,
    fetchSession,
    deleteSession,
}