import { IUser } from '@/store/auth/auth.slice';
import { TeamMember } from '@/store/projects/projects.slice';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import Avatar from './Avatar';
import useAuth from '@/hooks/useAuth';

type AssigneeCardProps = {
    assignee: IUser | TeamMember;
    onClick?: () => void;
    withImg?: boolean;
    isSelectable?: boolean;
    isSelected?: boolean;
    onRemove?: () => void;
}

const AssigneeCard = ({
    assignee,
    onClick,
    withImg = true,
    isSelectable = true,
    isSelected,
    onRemove,
}: AssigneeCardProps) => {
    const {getUserInitials, getUserName} = useAuth();
    
    const handleClick = () => {
        if (isSelectable && onClick) onClick();
    }

    const handleRemove = () => {
        if (isSelectable && onRemove) onRemove();
    }

  return (
    <AnimatePresence>
        {assignee && (
            <motion.div
                initial={{
                    scale: 0.7,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                        duration: 0.05
                    }
                }}
                exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                        duration: 0.1
                    }
                }}
                onClick={handleClick}
                className={twMerge(`
                    relative
                    flex
                    w-fit
                    min-w-14
                    border
                    border-slate-300
                    px-2
                    py-0.5
                    rounded-bl-lg
                    gap-2
                    items-center
                    ${isSelected
                        ? 'bg-orange-100'
                        : 'bg-slate-100'
                    }
                    ${isSelectable && !isSelected
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }
                `)}
            >
                <AnimatePresence>
                    {isSelectable && isSelected && (
                        <motion.button
                            type='button'
                            onClick={handleRemove}
                            initial={{
                                scale: 0.7,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    duration: 0.05
                                }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                                transition: {
                                    duration: 0.1
                                }
                            }}
                            className='absolute -top-2 -right-2 shadow-md shadow-gray-400 bg-white text-stone-400 border border-stone-300 w-4 h-4 text-[12px] rounded-full flex items-center justify-center active:text-stone-700 active:border-stone-700'
                        >
                            <RxCross2 />
                        </motion.button>
                    )}
                </AnimatePresence>
                
                {withImg && (
                    <Avatar
                        src={assignee.imgSrc}
                        text={getUserInitials(getUserName(assignee))}
                        additionalStyles='w-6 h-6'                
                    />
                )}

                <p className='font-medium text-stone-600'>{getUserName(assignee)}</p>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default AssigneeCard;