'use client'

import React, { ReactNode } from 'react';
import ButtonWithIcon from '../common/ButtonWithIcon';

type ModalTitleProps = {
  text: string;
  withIcon?: boolean;
  icon?: ReactNode;
  action?: () => void;
}

const ModalTitle = ({
  text,
  withIcon,
  icon,
  action
}: ModalTitleProps) => {
  return (
    <h2 className='w-full text-stone-700 text-xl font-semibold flex items-center justify-between'>
      {text}
      {/* {withIcon && (
        <ButtonWithIcon
          action={action}
          icon={icon}
          additionalStyles=''      
        />
      )} */}
    </h2>
  )
}

export default ModalTitle;