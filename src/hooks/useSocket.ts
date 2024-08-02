import { INotification, NewNotificationData } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type ServerToClientEvents = {
    notification: (notification: INotification) => void;
    online: (data: {userId: string}) => void;
    confirmedFriendRequest: (data: {userId: string}) => void;
    deniedFriendRequest: (data: {userId: string}) => void;
}

type ClientToServerEvents = {
    online: (userId: {userId?: string}) => void;
    notification: (notificationData: NewNotificationData) => void;
    friendRequest: (data: INotification) => void;
}

const URL: string = process.env.NEXT_PUBLIC_API_URL as string;

const useSocket = () => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    useEffect(() => {
        const socketInstance = io('http://localhost:3001', {
            transports: ["websocket"],
        });

        setSocket(socketInstance);

        // Cleanup function to disconnect the socket when the component unmounts
        // return () => {
        //     socketInstance.disconnect();
        // };
    }, [])

    return {
      socket
    }
}

export default useSocket;