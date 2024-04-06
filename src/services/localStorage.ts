import { User } from "@/store/auth/auth.slice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const saveJwt = (token: string): void => {
    return localStorage.setItem('token', token);
}

const getJwt = (): string => localStorage.getItem('token') as string;

const deleteJwt = (): void => localStorage.removeItem('token');

const getUserFromJwt = (): User => {
    try {
        return jwtDecode((getJwt() as string));
    } catch (error) {
        return null;
    }
}

const setTokenHeader = (): void => setCommonHeader('x-auth-token', getJwt() as string);

const setCommonHeader = (headerName: string, value: string | null): void => {
    axios.defaults.headers.common[headerName] = value;
}

const refreshUser = () => getUserFromJwt();

export {
    saveJwt,
    getJwt,
    deleteJwt,
    getUserFromJwt,
    setTokenHeader,
    refreshUser
}