'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';

const Teams = () => {
  return (
    <div id='teamsPage'>Teams</div>
  )
}

export default isAuth(Teams);