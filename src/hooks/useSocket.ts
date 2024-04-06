import { useEffect } from "react";
import { Socket, io } from "socket.io-client";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (...args: any[]) => void;
}

interface ClientToServerEvents {
    online: (userId: {userId?: string}) => void;
}

const useSocket = () => {

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_API_URL as string, {
      transports: ["websocket"],
    });

    useEffect(() => {
        if (!socket.connected) {
          socket.connect();
        }
    
        return () => {
          if (socket.connected) socket.disconnect();
        }
      }, [])

  return {
    socket
  }
}

export default useSocket;