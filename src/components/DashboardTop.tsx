'use client'

import React from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import useProjects from '@/hooks/useProjects';
import { HiMiniChevronLeft, HiMiniChevronRight } from 'react-icons/hi2';
import ProjectTitle from './ProjectTitle';
import Line from './common/Line';
import { BiPlus } from 'react-icons/bi';
import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteProjectPrompt, openNewStageModal } from '@/store/app/app.slice';
import { HiOutlineTrash } from 'react-icons/hi';

interface IDashboardTopProps {
  moveNext: () => void;
  movePrev: () => void;
  noMoreNext: boolean;
  noMorePrev: boolean;
}

const DashboardTop = ({moveNext, movePrev, noMoreNext, noMorePrev}: IDashboardTopProps) => {
    const {currentProject} = useProjects();

    const dispatch = useAppDispatch();

    const openModal = (): void => {
      dispatch(openNewStageModal());
    }
    
    const handleDeleteProject = (): void => {
      dispatch(openDeleteProjectPrompt());
    }

    const disabledStyles = 'sm:hidden disabled:border-slate-200 disabled:text-slate-200 disabled:hover:border-slate-200 disabled:hover:text-slate-200 disabled:cursor-default';

  return (
    <>
    <div className='flex items-center justify-between w-full'>
        <ProjectTitle title={currentProject?.title as string} subtitle={currentProject?.subtitle}/>

        <div className='flex items-center gap-1'>
            <ButtonWithIcon action={openModal} title='Add stage' icon={<BiPlus/>}/>
            <ButtonWithIcon action={handleDeleteProject} title='Delete project' icon={<HiOutlineTrash/>}/>
            <ButtonWithIcon disabled={noMorePrev} disabledStyles={disabledStyles} action={movePrev} additionalStyles='py-1 px-2' title='Previous stage' icon={<HiMiniChevronLeft/>} />
            <ButtonWithIcon disabled={noMoreNext} disabledStyles={disabledStyles} action={moveNext} additionalStyles='py-1 px-2' title='Next stage' icon={<HiMiniChevronRight/>} />
        </div>
    </div>

    <Line additionalStyles='my-2'/>
    </>
  )
}

export default DashboardTop;