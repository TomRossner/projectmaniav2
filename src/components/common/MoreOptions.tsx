import React, { useMemo } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import Option from '../Option';
import { TOption } from '@/utils/types';
import { createOption } from '@/utils/utils';
import { twMerge } from 'tailwind-merge';

type MoreOptionsProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    options: string[];
    action?: (arg: TOption) => void;
    additionalStyles?: string;
}

const MoreOptions = ({
    isOpen,
    setIsOpen,
    options,
    action = () => {},
    additionalStyles,
}: MoreOptionsProps) => {
    const createOptions = (opts: string[]): TOption[] => {
        return opts.map(opt => createOption(opt));
    }

    const opts = useMemo(() => createOptions(options), [options]);
  return (
    <AnimatePresence>
        {isOpen && (
            <motion.ul
                className={twMerge(`
                    w-[100px]
                    z-30
                    absolute
                    right-3
                    top-8
                    bg-white
                    border
                    border-slate-300
                    rounded-bl-lg
                    flex
                    flex-col
                    shadow-md
                    overflow-hidden
                    ${additionalStyles}
                `)}
                initial={{
                    scale: 0.7,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                        duration: 0.07
                    }
                }}
                exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                        duration: 0.1
                    }
                }}
            >
                {opts.map((opt: TOption, idx: number) => {
                    return (
                        <Option
                            key={idx}
                            action={() => action(opt)}
                            isDisabled={opt.disabled}
                            opt={opt}
                        />
                    )
                })}
            </motion.ul>
        )}
    </AnimatePresence>
  )
}

export default MoreOptions;