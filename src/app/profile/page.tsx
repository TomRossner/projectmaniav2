'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';

const Profile = () => {
  return (
    <div id='profilePage'>Profile</div>
  )
}

export default isAuth(Profile);