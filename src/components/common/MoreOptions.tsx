import React, { ForwardedRef, RefObject, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import Option from '../Option';
import { TOption } from '@/utils/types';
import { createOption } from '@/utils/utils';
import { twMerge } from 'tailwind-merge';
import useOnClickOutside from '@/hooks/useOnClickOutside';

type MoreOptionsProps = {
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
    options: string[];
    action?: (arg: TOption) => void;
    additionalStyles?: string;
    disabled?: boolean;
}

const MoreOptions = (props: MoreOptionsProps) => {
    const {
        isOpen,
        setIsOpen,
        options,
        action = () => {},
        additionalStyles,
        disabled = false,
    } = props;

    const moreOptionsRef = useRef<HTMLUListElement>(null);
    
    useOnClickOutside(moreOptionsRef as RefObject<HTMLUListElement>, () => setIsOpen(false));

    const createOptions = (opts: string[]): TOption[] => {
        return opts.map(opt => createOption(opt));
    }

    const opts = useMemo(() => {
        return createOptions(options);
    }, [options])

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.ul
                ref={moreOptionsRef as RefObject<HTMLUListElement>}
                className={twMerge(`
                    w-[100px]
                    z-50
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
                            isDisabled={opt.text === 'Edit' || opt.text === 'Delete'
                                ? false
                                : disabled
                            }
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