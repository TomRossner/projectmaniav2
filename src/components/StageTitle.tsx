'use client'

import React from 'react';

const StageTitle = ({title}: {title: string}) => {
  return (
    <h2 className='text-2xl flex-1 truncate'>
      {title}
    </h2>
  )
}

export default StageTitle;