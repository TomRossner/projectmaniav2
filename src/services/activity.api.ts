import { Activity, NewActivityData } from "@/utils/interfaces";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const getActivityLog = async (projectId: string, page: number, limit?: number) => {
    return await axios.get(`/activities`, {
        params: {
            projectId,
            page,
            limit,
        },
        withCredentials: true
    })
}

const createActivity = async (newActivityData: NewActivityData) => {
    return await axios.post(`/activities`, newActivityData);
}

const updateActivity = async (activity: Activity) => {
    return await axios.put(`/activities/${activity.activityId}`, activity);
}

const deleteActivity = async (activityId: string) => {
    return await axios.delete(`/activities/${activityId}`);
}

export {
    getActivityLog,
    createActivity,
    updateActivity,
    deleteActivity,
}