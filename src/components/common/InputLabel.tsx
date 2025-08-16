'use client'

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type LabelProps = {
    htmlFor?: string;
    text?: string;
    additionalStyles?: string;
    title?: string;
    isOptional?: boolean;
    isTitle?: boolean;
    isRequired?: boolean;
    isSelectable?: boolean;
    withIcon?: boolean;
    icon?: ReactNode;
    isModified?: boolean;
}

const InputLabel = ({
  htmlFor,
  text,
  additionalStyles,
  title,
  isOptional = false,
  isTitle = false,
  isRequired = false,
  isSelectable = false,
  withIcon = false,
  icon,
  isModified = false,
}: LabelProps) => {

  // Should return tag?
  return (
    <>
      {isTitle ? (
        <p
          className={twMerge(`
            text-xl
            w-full
            cursor-default
            flex
            items-center
            gap-1
            text-nowrap
            ${additionalStyles}
            ${isOptional || isRequired && 'flex items-center gap-1'}
            ${isRequired && 'justify-between w-full'}
          `)}
        >
          <span className='flex items-center gap-2'>
            <span>
              {text}
              {isRequired && (
                <span className='text-red-300'>*</span>
              )}
            </span>
            {isModified && (
              <span className='italic opacity-65 text-yellow-500 text-sm font-normal'>(modified)</span>
            )}
          </span>
          {(isOptional || isRequired) && (
            <span className='text-sm text-slate-400'>
              {isOptional ? "(optional)" : (
                <span className='text-red-300'>required</span>
              )}
            </span>
          )}
        </p>
      ) : (
        <label
          htmlFor={htmlFor}
          title={title}
          className={twMerge(`
            text-xl
            select-none
            text-nowrap
            ${(text?.toLowerCase() === "bug") && "bg-yellow-400 border-yellow-600"}
            ${(text?.toLowerCase() === "feature") && "bg-violet-400 border-violet-600"}
            ${(text?.toLowerCase() === "ui") && "bg-teal-400 border-teal-600"}
            ${(text?.toLowerCase() === "hotfix") && "bg-orange-400 border-orange-600"}
            ${(text?.toLowerCase() === "backend") && "bg-sky-400 border-sky-600"}
            ${isSelectable && "bg-opacity-70 active:bg-opacity-100 sm:hover:bg-opacity-100"}
            ${additionalStyles}
            ${(isOptional || isRequired || withIcon) && 'flex items-center gap-1'}
            ${(withIcon && !text) && 'gap-0'}
            ${isRequired && 'flex justify-between w-full items-center'}
          `)}
        >
          {withIcon && icon}
          <span>
            {text}
            {isRequired && <span className='text-red-300'>*</span>}
          </span>
          {(isOptional || isRequired) && (
            <span className={`text-sm text-slate-400`}>
              {isOptional ? "(optional)" : (
                <span className='text-red-300'>required</span>
              )}
            </span>
          )}
        </label>
      )}
    </>
  )
}

export default InputLabel;