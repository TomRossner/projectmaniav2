import { IUser } from "@/store/auth/auth.slice";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = 'http://localhost:3001';

const updateUser = async (updatedUserData: IUser): Promise<AxiosResponse> =>
    await axios.put(`/users/${updatedUserData.userId}`, updatedUserData);

const getUsersByQuery = async (query: string): Promise<AxiosResponse> =>
    await axios.post(`/users`, {query});

export {
    updateUser,
    getUsersByQuery,
}
