'use client'

import React from 'react';
import Label from './Label';

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
  } = props;

  return (
    <>
        <Label
          htmlFor={id}
          labelText={labelText}
          additionalStyles={labelAdditionalStyles ? labelAdditionalStyles : 'text-stone-800'}
        />

        <input
            autoComplete='on'
            onChange={onChange}
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            className={`
                ${additionalStyles}
                px-2
                text-lg
                text-stone-600
                border-slate-300
                border
                rounded-bl-lg
                outline-none
                focus:border-blue-500
            `}
        />
    </>
  )
}

export default Input;