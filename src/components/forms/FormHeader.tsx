'use client'

import React from 'react';

interface IFormHeaderProps {
    text: string;
}

const FormHeader = ({text}: IFormHeaderProps) => {
  return (
    <h2 className='text-center text-2xl text-black'>
      {text}
    </h2>
  )
}

export default FormHeader;