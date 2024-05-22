import { MAX_EXTERNAL_LINKS } from '@/utils/constants';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type ItemCountProps = {
    count: number;
    additionalStyles?: string;
}

const ItemCount = ({count = 10, additionalStyles}: ItemCountProps) => {
  return (
    <span
        className={twMerge(`
            w-3
            h-3
            absolute
            -top-1.5
            -right-1.5
            p-1.5
            shadow-sm
            z-10
            shadow-slate-500
            bg-white
            border
            rounded-full
            flex
            items-center
            justify-center
            text-center
            font-sans
            font-bold
            text-stone-400
            ${count >= MAX_EXTERNAL_LINKS
                ? "text-[8px]"
                : "text-[10px]"
            }
            ${additionalStyles}
        `)}
    >
        {count}
    </span>
  )
}

export default ItemCount