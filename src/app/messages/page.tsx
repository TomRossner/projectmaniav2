'use client'

import React, { useEffect } from 'react';
import isAuth from '../ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import { getSocket } from '@/utils/socket';

const Messages = () => {
  const {user, isAuthenticated, userId} = useAuth();
  
  const socket = getSocket();

  const unreadMessages = [];

  useEffect(() => {
    if (isAuthenticated && socket) {
      socket.on("connect", () => {
        console.log("Socket connected");

        socket.emit("online", {
          userId
        });
      });
    }
  }, [isAuthenticated, socket, userId])

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