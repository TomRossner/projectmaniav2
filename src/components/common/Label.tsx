'use client'

import React from 'react';

interface ILabelProps {
    htmlFor: string;
    labelText: string;
    additionalStyles?: string;
    title?: string;
}

const Label = ({htmlFor, labelText, additionalStyles, title}: ILabelProps) => {
  return (
    <label htmlFor={htmlFor} title={title} className={`${additionalStyles} text-xl`}>
        {labelText}
    </label>
  )
}

export default Label;