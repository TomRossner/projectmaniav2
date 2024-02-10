'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';

const Settings = () => {
  return (
    <div id='settingsPage'>Settings</div>
  )
}

export default isAuth(Settings);