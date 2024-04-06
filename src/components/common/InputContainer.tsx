'use client'

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IInputContainerProps {
    input: ReactNode;
    additionalStyles?: string;
}

const InputContainer = ({input, additionalStyles}: IInputContainerProps) => {
  return (
    <div className={twMerge(`flex flex-col w-full mx-auto ${additionalStyles}`)}>
        {input}
    </div>
  )
}

export default InputContainer;