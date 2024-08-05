import { IProject, IStage, ITask } from "@/store/projects/projects.slice";
import { INotification, NewNotificationData } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type ServerToClientEvents = {
    notification: (notification: INotification) => void;
    online: (data: {userId: string}) => void;
    confirmedFriendRequest: (data: {userId: string}) => void;
    deniedFriendRequest: (data: {userId: string}) => void;
    // Tasks
    newTask: (data: ITask) => void;
    deleteTask: (data: ITask) => void;
    updateTask: (data: ITask) => void;
    // Stages
    newStage: (data: IStage) => void;
    deleteStage: (data: IStage) => void;
    updateStage: (data: IStage) => void;
    // Project
    newProject: (data: IProject) => void;
    deleteProject: (data: IProject) => void;
    updateProject: (data: IProject) => void;
}

type ClientToServerEvents = {
    online: (userId: {userId?: string}) => void;
    notification: (notification: INotification) => void;
    friendRequest: (data: INotification) => void;
    updateSocketId: (data: {userId: string, socketId: string}) => void;
    // Tasks
    newTask: (data: ITask) => void;
    deleteTask: (data: ITask) => void;
    updateTask: (data: ITask) => void;
    // Stages
    newStage: (data: IStage) => void;
    deleteStage: (data: IStage) => void;
    updateStage: (data: IStage) => void;
    // Project
    newProject: (data: IProject) => void;
    deleteProject: (data: IProject) => void;
    updateProject: (data: IProject) => void;
    connection: () => void;
}

const URL: string = process.env.NEXT_PUBLIC_API_URL as string;

type SocketEvent =
    "notification" |
    "online" |
    "newTask" |
    "deleteTask" |
    "updateTask" |
    "newStage" |
    "deleteStage" |
    "updateStage" |
    "newProject" |
    "deleteProject" |
    "updateProject" |
    "friendRequest" |
    "updateSocketId" |
    "connection";

const useSocket = (id: string) => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    const emitEvent = (event: SocketEvent, data: any) => {
        socket?.emit(event, data);
    }

    useEffect(() => {
        if (!id) return;

        console.log("Socket id: ", id);

        const socketInstance = io('http://localhost:3001', {
            transports: ["websocket"],
            query: { id }
        });

        setSocket(socketInstance);

        // Cleanup function to disconnect the socket when the component unmounts
        return () => {
            socketInstance.close();
        };
    }, [id])
    
    // useEffect(() => {
    //     if (!socket) {
    //         console.log("Connecting socket...")
    //         socket = io('http://localhost:3001', {
    //             transports: ["websocket"],
    //         });
    //     }

    //   }, []);

    return {
      socket,
      emitEvent
    }
}

export default useSocket;