import { IUser } from "@/store/auth/auth.slice";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;
axios.defaults.withCredentials = true;

const updateUserData = async (userData: IUser) => {
    // Returns updated token to save in LocalStorage
    return await updateUser(userData);
} 

const updateUser = async (updatedUserData: IUser): Promise<AxiosResponse> =>
    await axios.put(`/users/${updatedUserData.userId}`, updatedUserData);

const getUsersByQuery = async (query: string): Promise<AxiosResponse> =>
    await axios.get(`/users`, {params: {query}});

const getUserById = async (userId: string) =>
    await axios.post(`/users/${userId}`);

export {
    updateUser,
    getUsersByQuery,
    updateUserData,
    getUserById
}
