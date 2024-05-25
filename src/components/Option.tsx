import { StageOptions, TOption } from '@/utils/types';
import React from 'react';
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
        </button>
    </>
  )
}

export default Option;