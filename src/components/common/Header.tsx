'use client'

import React from 'react';
import { twMerge } from 'tailwind-merge';

type PageHeaderProps = {
    text: string;
    additionalStyles?: string;
}

const Header = ({text, additionalStyles}: PageHeaderProps) => {
  return (
    <h1 className={twMerge(`text-stone-700 text-4xl font-semibold ${additionalStyles}`)}>
      {text}
    </h1>
  )
}

export default Header;