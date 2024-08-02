import { NewProjectData, IProject, IStage, ITask } from "@/store/projects/projects.slice";
import { NewTaskData } from "@/utils/interfaces";
import { NewStageData } from "@/utils/types";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;
axios.defaults.withCredentials = true;
// Project
// /api/projects/:projectId

// Stage
// /api/stages/:stageId

// Task
// /api/tasks/:taskId



// Projects API

const getAllProjects = async (userId: string) =>
    await axios.get('/projects', {
        params: {
            userId
        },
        withCredentials: true
    });
    
const createProject = async (projectData: NewProjectData) =>
    await axios.post('/projects/', projectData);

const getProject = async (projectId: string) =>
    await axios.get(`/projects/${projectId}`);

const updateProject = async (project: IProject) =>
    await axios.put(`/projects/${project.projectId}`, project);

const deleteProject = async (projectId: string) =>
    await axios.delete(`/projects/${projectId}`);


// Stages API
const createStage = async (stageData: NewStageData) =>
    await axios.post(`/stages/`, stageData);

const updateStage = async (stage: IStage) =>
    await axios.put(`/stages/${stage.stageId}/`, stage);

const deleteStage = async (stageId: string) =>
    await axios.delete(`/stages/${stageId}`);

// Tasks

const deleteTask = async (taskId: string) =>
    await axios.delete(`/tasks/${taskId}`);

const createTask = async (newTask: NewTaskData) =>
    await axios.post(`/tasks/`, newTask);

const updateTask = async (task: ITask) =>
    await axios.put(`/tasks/${task.taskId}`, task);


// const updateProjectTitle = async (project: IProject) =>
//     await axios.put(`/projects/${project.projectId}/update-title`, project);

// const newUpdateProject = async (project: IProject) => {
//     return await axios.put(`/projects/${project.projectId}`, project);
// }
export {
    getAllProjects,

    createProject,
    getProject,
    updateProject,
    deleteProject,

    createStage,
    updateStage,
    deleteStage,

    createTask,
    updateTask,
    deleteTask,
    // createNewTask,
    // updateStageTitle,
    // updateProjectTitle,
    // newUpdateProject,
}