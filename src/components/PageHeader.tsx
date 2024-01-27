'use client'

import React from 'react';

interface IPageHeaderProps {
    text: string;
}

const PageHeader = ({text}: IPageHeaderProps) => {
  return (
    <h1 className='text-stone-700 text-4xl font-semibold'>{text}</h1>
  )
}

export default PageHeader;