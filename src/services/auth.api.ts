import { LoginCredentials, IUserSignUpData } from "@/utils/interfaces";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const signUp = async (userData: IUserSignUpData) =>
    await axios.post('/users', userData);

const login = async (credentials: LoginCredentials) =>
    await axios.post('/sessions', credentials, {withCredentials: true});

const googleSignIn = async () =>
    await axios.post(`/auth/login/google`, {withCredentials: true});

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
    return response;
}

const logout = async () => await axios.get('/auth/logout');

export {
    signUp,
    login,
    googleSignIn,
    fetchSession,
    deleteSession,
    logout,
}