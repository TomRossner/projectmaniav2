'use client'

import React from 'react';
import {RxCross2} from "react-icons/rx"

interface ICrossProps {
    action: () => void;
    additionalStyles?: string;
}

const Cross = ({action, additionalStyles}: ICrossProps) => {
  return (
    <div onClick={action} className={`
      ${additionalStyles}
      cursor-pointer
      p-2
      w-9
      z-50
      rounded-bl-lg
      flex
      items-center
      justify-center
      text-center
      text-xl
      text-white
      fixed
      right-2
      top-2
      bg-blue-400
      hover:bg-blue-500
    `}>
        <RxCross2/>
    </div>
  )
}

export default Cross;