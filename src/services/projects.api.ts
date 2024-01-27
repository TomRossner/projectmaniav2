import { IBaseProject, IProject, IStage } from "@/store/projects/projects.slice";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = 'http://localhost:3001';

const createProject = async (project: IBaseProject | Partial<IProject>): Promise<AxiosResponse> => {
    return await axios.post('/projects/new-project', project);
}

const getAllProjects = async (userId: string): Promise<AxiosResponse> => {
    return await axios.get('/projects', {
        params: {
            userId
        }
    })
}

const createStage = async (projectId: string, stageData: IStage): Promise<AxiosResponse> => {
    return await axios.post(`/projects/${projectId}/new-stage`, stageData);
}

const updateProject = async (project: IProject): Promise<AxiosResponse> => {
    return await axios.put(`/projects/update-project`, project);
}

const deleteProject = async (projectId: string): Promise<AxiosResponse> => {
    return await axios.delete(`projects/${projectId}`);
}

export {
    createProject,
    getAllProjects,
    createStage,
    updateProject,
    deleteProject
}