'use client'

import React from 'react';

const Line = ({additionalStyles}: {additionalStyles?: string}) => {
  return (
    <hr className={`${additionalStyles} w-full`}/>
  )
}

export default Line;