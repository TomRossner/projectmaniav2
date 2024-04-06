'use client'

import React from 'react';
import StageTop from './StageTop';
import StageContent from './StageContent';
import { useAppDispatch } from '@/hooks/hooks';
import { IStage, setCurrentStage } from '@/store/projects/projects.slice';

const Stage = (stage: IStage) => {
    const dispatch = useAppDispatch();

  return (
      <div
        onClick={() => dispatch(setCurrentStage(stage))}
        className={`
          w-full
          h-full
          items-start
          snap-center
          snap-always
          shrink-0
          flex
          self-start
          max-w-[430px]
          border-l
          border-r
          border-l-slate-100
          border-r-slate-100w-full
          flex-col
          min-h-full
          relative
          overflow-hidden
        `}
      >
        <StageTop {...stage} />
        <StageContent {...stage} />
      </div>
  )
}

export default Stage;