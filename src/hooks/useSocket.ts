import { INotification, NewNotificationData } from "@/utils/interfaces";
import { Socket, io } from "socket.io-client";

type ServerToClientEvents = {
    noArg: () => void;
    basicEmit: (...args: any[]) => void;
    notification: (notification: INotification) => void;
}

type ClientToServerEvents = {
    online: (userId: {userId?: string}) => void;
    notification: (notificationData: NewNotificationData) => void;
}

const useSocket = () => {
    const URL: string = process.env.NEXT_PUBLIC_API_URL as string;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
      transports: ["websocket"],
    });

    // useEffect(() => {
    //     if (!socket.connected) {
    //       socket.connect();
    //     }
    
    //     return () => {
    //       if (socket.connected) socket.disconnect();
    //     }
    //   }, [])

  return {
    socket
  }
}

export default useSocket;