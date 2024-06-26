import { IBaseProject, IProject, IStage, ITask } from "@/store/projects/projects.slice";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const createProject = async (project: IBaseProject | Partial<IProject>): Promise<AxiosResponse> =>
    await axios.post('/projects/new-project', project);

const getAllProjects = async (userId: string): Promise<AxiosResponse> =>
    await axios.get('/projects', {
        params: {
            userId
        }
    })

const getProjectById = async (projectId: string): Promise<AxiosResponse> =>
    await axios.get(`/projects/id/${projectId}`);

const createStage = async (projectId: string, stageData: IStage): Promise<AxiosResponse> =>
    await axios.post(`/projects/${projectId}/new-stage`, stageData);

const updateProject = async (project: IProject): Promise<AxiosResponse> =>
    await axios.put(`/projects/update-project`, project);

const deleteProject = async (projectId: string): Promise<AxiosResponse> =>
    await axios.delete(`projects/${projectId}`);

const deleteTask = async (taskId: string): Promise<AxiosResponse> =>
    await axios.delete(`projects/tasks/${taskId}`);

const createNewTask = async (newTask: Partial<ITask>): Promise<AxiosResponse> =>
    await axios.post(`/projects/new-task`, newTask);

export {
    createProject,
    getAllProjects,
    getProjectById,
    createStage,
    updateProject,
    deleteProject,
    deleteTask,
    createNewTask
}