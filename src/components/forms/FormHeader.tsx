'use client'

import React from 'react';

type FormHeaderProps = {
    text: string;
}

const FormHeader = ({text}: FormHeaderProps) => {
  return (
    <h2 className='text-center text-2xl text-black'>
      {text}
    </h2>
  )
}

export default FormHeader;