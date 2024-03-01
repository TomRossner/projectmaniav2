'use client'

import React from 'react';
import StageTop from './StageTop';
import StageContent from './StageContent';
import { useAppDispatch } from '@/hooks/hooks';
import { IStage, setCurrentStage } from '@/store/projects/projects.slice';

const Stage = (stage: IStage) => {
    const dispatch = useAppDispatch();

  return (
    <div onClick={() => dispatch(setCurrentStage(stage))} className='border rounded-bl-lg max-w-md w-full snap-center snap-always shrink-0 flex items-center'>
      <div className='w-full h-full flex flex-col items-center'>
          <StageTop {...stage}/>
          <StageContent {...stage}/>
      </div>
    </div>
  )
}

export default Stage;