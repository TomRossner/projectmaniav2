'use client'

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ILabelProps {
    htmlFor: string;
    labelText: string;
    additionalStyles?: string;
    title?: string;
    isOptional?: boolean;
}

const Label = ({
  htmlFor,
  labelText,
  additionalStyles,
  title,
  isOptional = false
}: ILabelProps) => {
  return (
    <>
      <label
        htmlFor={htmlFor}
        title={title}
        className={twMerge(`
          text-xl
          ${additionalStyles}
          ${isOptional && 'flex items-center gap-1'}
        `)}
      >
        {labelText}
        {isOptional && <span className='text-sm text-slate-400'>(optional)</span>}
      </label>

    </>
  )
}

export default Label;