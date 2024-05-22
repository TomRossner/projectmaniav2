'use client'

import React from 'react';

const ProjectTitle = ({title, subtitle}: {title: string, subtitle?: string}) => {
  return (
    <h2 className='self-start flex items-center gap-1 truncate text-2xl font-semibold text-stone-700'>
      {title}
      
      {subtitle && (
        <span> - {subtitle}</span>
      )}
    </h2>
  )
}

export default ProjectTitle;