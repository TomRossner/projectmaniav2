'use client'

import React, { ReactNode } from 'react';

interface IInputContainerProps {
    input: ReactNode;
    additionalStyles?: string;
}

const InputContainer = ({input, additionalStyles}: IInputContainerProps) => {
  return (
    <div className={`${additionalStyles} flex flex-col w-full mx-auto`}>
        {input}
    </div>
  )
}

export default InputContainer;