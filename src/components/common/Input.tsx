'use client'

import React, { ForwardedRef, ReactNode, forwardRef } from 'react';
import InputLabel from './InputLabel';
import { twMerge } from 'tailwind-merge';

type InputProps = {
    type: string;
    id: string;
    name: string;
    value?: string | number | readonly string[] | undefined;
    placeholder?: string;
    additionalStyles?: string;
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    labelAdditionalStyles?: string;
    labelText?: string;
    isOptional?: boolean;
    inputIcon?: ReactNode;
    withIconInsideInput?: boolean;
    isRequired?: boolean;
    onBlur?: () => void;
    hidden?: boolean;
    searchIcon?: ReactNode;
    isChecked?: boolean;
}

const Input = forwardRef(function Input(props: InputProps, ref: ForwardedRef<HTMLInputElement>) {
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
    isOptional,
    inputIcon,
    withIconInsideInput = false,
    isRequired = false,
    onBlur,
    hidden = false,
    searchIcon,
    isChecked = false
  } = props;

  return (
    <>
        <InputLabel
          htmlFor={id}
          text={labelText as string}
          additionalStyles={labelAdditionalStyles}
          isOptional={isOptional}
          isRequired={isRequired}
        />

        {withIconInsideInput ? (
          <div className='flex items-center relative grow w-full overflow-x-hidden bg-white border border-slate-300 rounded-bl-lg'>
            {searchIcon && (
              <span className='flex items-center justify-center px-1 inset-y-0 start-0 text-stone-400'>
                {searchIcon}
              </span>
            )}

            <input
                autoComplete='off'
                onChange={onChange}
                onBlur={onBlur}
                type={type}
                id={id}
                name={name}
                value={value}
                ref={ref}
                hidden={hidden}
                placeholder={placeholder}
                checked={isChecked}
                className={twMerge(`
                  text-lg
                  text-stone-600
                  autofill:bg-white
                  outline-none
                  focus:border-blue-500
                  flex-shrink-0
                  pt-1
                  bg-white
                  ${additionalStyles}
              `)}
            />

            {withIconInsideInput && (
              <span className='flex items-center justify-center absolute inset-y-0 end-0 bg-white'>
                {inputIcon}
              </span>
            )}

          </div>
        ) : (
          <input
            autoComplete='off'
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            id={id}
            ref={ref}
            hidden={hidden}
            name={name}
            value={value}
            placeholder={placeholder}
            checked={isChecked}
            className={twMerge(`
                px-2
                text-lg
                text-stone-600
                border-slate-300
                autofill:bg-white
                outline-none
                focus:border-blue-500
                flex-shrink-0
                grow
                border
                rounded-bl-lg
                bg-white
                ${additionalStyles}
            `)}
          />
        )}
    </>
  )
});

export default Input;