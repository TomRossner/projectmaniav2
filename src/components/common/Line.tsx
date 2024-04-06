'use client'

import React from 'react';
import { twMerge } from 'tailwind-merge';

const Line = ({additionalStyles}: {additionalStyles?: string}) => {
  return (
    <hr className={twMerge(`w-full ${additionalStyles}`)}/>
  )
}

export default Line;