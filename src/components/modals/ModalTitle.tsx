'use client'

import React from 'react';

const ModalTitle = ({text}: {text: string}) => {
  return (
    <h2 className='text-stone-700 text-xl font-semibold'>{text}</h2>
  )
}

export default ModalTitle;