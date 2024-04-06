'use client'

import Image from 'next/image';
import React from 'react';
import loading from '../../assets/loading.png';

const LoadingIcon = () => {
  return (
    <Image
      src={loading}
      width={25}
      height={25}
      alt='Loading'
      className='absolute left-0 top-0 animate-spin aspect-square opacity-80'
    />
  )
}

export default LoadingIcon;