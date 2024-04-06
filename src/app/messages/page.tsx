'use client'

import React, { useEffect } from 'react';
import isAuth from '../ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import useSocket from '@/hooks/useSocket';

const Messages = () => {
  const {user} = useAuth();
  
  const {socket} = useSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("online", {userId: user?.userId});
    });
  }, [])

  return (
    <div id='messagesPage'>Messages</div>
  )
}

export default isAuth(Messages);