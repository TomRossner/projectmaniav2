'use client'

import React from 'react';

const ProjectTitle = ({title, subtitle}: {title: string, subtitle?: string}) => {
  return (
    <p className='self-start flex items-center gap-1'>
        <span className='text-2xl font-semibold text-stone-700'>{title}</span>
        {subtitle ? <span> - {subtitle}</span> : null}
    </p>
  )
}

export default ProjectTitle;