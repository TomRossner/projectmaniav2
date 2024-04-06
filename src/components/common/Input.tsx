'use client'

import React from 'react';
import Label from './Label';
import { twMerge } from 'tailwind-merge';

export interface IInputProps {
    type: string;
    id: string;
    name: string;
    value?: any;
    placeholder?: string;
    additionalStyles?: string;
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    labelAdditionalStyles?: string;
    labelText: string;
    isOptional?: boolean;
}

const Input = (props: IInputProps) => {
  const {
    type,
    id,
    name,
    value,
    placeholder,
    additionalStyles,
    labelAdditionalStyles,
    labelText,
    onChange,
    isOptional
  } = props;

  return (
    <>
        <Label
          htmlFor={id}
          labelText={labelText}
          additionalStyles={labelAdditionalStyles
            ? labelAdditionalStyles
            : 'text-stone-800'
          }
          isOptional={isOptional}
        />

        <input
            autoComplete='on'
            onChange={onChange}
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            className={twMerge(`
                px-2
                text-lg
                text-stone-600
                border-slate-300
                border
                rounded-bl-lg
                outline-none
                focus:border-blue-500
                flex-shrink-0
                ${additionalStyles}
            `)}
        />
    </>
  )
}

export default Input;