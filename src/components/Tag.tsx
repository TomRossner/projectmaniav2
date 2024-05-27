import { TagName } from '@/utils/types';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type TagProps = {
    tag: TagName;
    additionalStyles?: string; 
}

const Tag = ({tag, additionalStyles}: TagProps) => {
  return (
    <>
      {tag && (
        <div
          className={twMerge(`
            min-w-[40px]
            px-4
            rounded-bl-lg
            text-white
            border
            shadow-sm
            text-center
            self-stretch
            pt-1
            select-none
            text-sm
            ${(tag.toLowerCase() === "bug") && "bg-yellow-400 border-yellow-600"}
            ${(tag.toLowerCase() === "feature") && "bg-violet-400 border-violet-600"}
            ${(tag.toLowerCase() === "ui") && "bg-teal-400 border-teal-600"}
            ${(tag.toLowerCase() === "hotfix") && "bg-orange-400 border-orange-600"}
            ${(tag.toLowerCase() === "backend") && "bg-cyan-400 border-sky-600"}
            ${additionalStyles}
          `)}
        >
          {tag?.toUpperCase()}
        </div>
      )}
    </>
  )
}

export default Tag;