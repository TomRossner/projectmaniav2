import React from 'react';
import { BsCircleFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

const MostRecentProjectSkeleton = () => {
    const TEAM_LENGTH = 3;

    const className = (idx: number): string => {
        const increment = idx * 5;
        if (idx > 0) return `absolute right-[${increment}px] z-[${increment}]`;
        return '';
    }

  return (
    <div className='animate-pulse w-full p-4 h-auto bg-blue-100 rounded-bl-lg sm:max-w-xl flex flex-col gap-3'>
        <h4 className='bg-blue-200 animate-pulse p-3 w-2/3 rounded-full sm:w-1/2 lg:w-1/3' />
        
        <div className='grow' />

        <div className='flex items-center gap-1 w-full'>
            <p className='bg-blue-200 animate-pulse p-2 w-1/3 rounded-lg sm:w-1/3' />
            <BsCircleFill className='w-1 h-1 text-blue-200 animate-pulse' />
            <p className='bg-blue-200 animate-pulse p-2 w-1/3 rounded-lg sm:w-1/3' />
        </div>
        
        <div className='flex items-center w-1/2 h-8 bg-blue-200 rounded-full animate-pulse'>
            {/* {[...Array(TEAM_LENGTH)].map((_, i: number) => (
                <div key={i} className='relative h-7 w-7'>
                    <p
                        className={twMerge(`
                            bg-blue-200
                            animate-pulse
                            w-7
                            h-7
                            p-3
                            rounded-full
                            sm:w-1/2
                            lg:w-1/3
                            ${className(i)}
                        `)}
                    />
                </div>
            ))} */}
        </div>
    </div>
  )
}

export default MostRecentProjectSkeleton;