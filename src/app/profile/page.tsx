'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';
import Container from '@/components/common/Container';

const Profile = () => {
  return (
    <Container id='profilePage'>Profile</Container>
  )
}

export default isAuth(Profile);