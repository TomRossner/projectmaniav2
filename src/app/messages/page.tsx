'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';

const Messages = () => {
  return (
    <div id='messagesPage'>Messages</div>
  )
}

export default isAuth(Messages);