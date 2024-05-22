import { StageOptions, TOption } from '@/utils/types';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

type OptionProps = {
    opt?: TOption;
    stageOpt?: StageOptions;
    action: (...args: unknown[]) => void;
    state?: boolean;
    isDisabled?: boolean;
    isStageOption?: boolean;
}

const Option = ({
    opt,
    action = () => {},
    state,
    isDisabled = false,
    isStageOption = false,
    stageOpt,
}: OptionProps) => {
    const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false);
  return (
    <>
        <button
            type='button'
            onClick={() => action(opt)}
            className={twMerge(`
                pt-0.5
                px-1.5
                text-stone-500
                active:text-stone-800
                sm:hover:text-stone-800
                relative
                flex
                w-full
                justify-between
                disabled:text-stone-300
                disabled:cursor-not-allowed
                disabled:sm:hover:text-stone-300
                disabled:active:text-stone-300
                sm:hover:bg-slate-100
                active:bg-slate-100
            `)}
            disabled={isDisabled}
        >
            {!isStageOption ? opt?.text : stageOpt?.option}
            {/* {!!opt.subOptions?.length && (
                <span className='py-1'>
                    <BsChevronRight className='w-3 h-3' />
                </span>
            )} */}

        </button>
        {/* {!!opt.subOptions?.length && (
            <AnimatePresence>
                {state &&
                    <motion.div
                        initial={{
                            scale: 0.7,
                            opacity: 0,
                            zIndex: 20,
                            position: "absolute",
                            top: 0,
                            left: -105,
                            marginBlock: "auto",
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
                        <div className='w-[100px] flex flex-col p-1 border border-slate-300 bg-white rounded-bl-lg'>
                            {opt.subOptions?.map(opt => {
                                return (
                                    // <Option
                                    //     key={opt.option}
                                    //     opt={opt}
                                    //     action={() => setSubMenuOpen(!subMenuOpen)}
                                    //     state={subMenuOpen}
                                    // />
                                    <li key={opt.option}>{opt.option}</li>
                                )
                            })}
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        )} */}
    </>
  )
}

export default Option;