'use client'

import React, { useEffect } from 'react';
import isAuth from '../ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import useSocket from '@/hooks/useSocket';
import Header from '@/components/common/Header';
import Container from '@/components/common/Container';

const Messages = () => {
  const {user, isAuthenticated} = useAuth();
  
  const {socket} = useSocket();

  const unreadMessages = []

  useEffect(() => {
    if (isAuthenticated) {
      socket.on("connect", () => {
        console.log("Socket connected");

        socket.emit("online", {
          userId: user?.userId
        });
      });
    }
  }, [isAuthenticated])

  return (
    <Container id='messagesPage'>
      <Header text={`Hi ${user?.firstName},`} />

      <p>
        You have {unreadMessages.length} unread message{unreadMessages.length === 1 ? "" : "s"}
      </p>

    </Container>
  )
}

export default isAuth(Messages);