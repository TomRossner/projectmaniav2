'use client'

import React from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import useProjects from '@/hooks/useProjects';
import { HiMiniChevronLeft, HiMiniChevronRight } from 'react-icons/hi2';
import ProjectTitle from './ProjectTitle';
import Line from './common/Line';
import { BiPlus } from 'react-icons/bi';
import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteProjectPrompt, openEditProjectModal, openNewStageModal } from '@/store/app/app.slice';
import { HiOutlineTrash } from 'react-icons/hi';
import { RiEditLine } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

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

    const disabledStyles: string = twMerge(`
      disabled:border-slate-200
      disabled:text-slate-200
      disabled:hover:border-slate-200
      disabled:hover:text-slate-200
      disabled:cursor-default
      ${(currentProject!.stages.length <= 2) && 'sm:hidden'}
    `);

    const handleEdit = (): void => {
      dispatch(openEditProjectModal());
    }
    
  return (
    <>
    <div className='flex items-center justify-between w-full group'>
        <div className='flex items-center gap-3 hover:nth'>
          <ProjectTitle
            title={currentProject?.title as string}
            subtitle={currentProject?.subtitle}
          />

          <ButtonWithIcon
            additionalStyles='group-hover:flex sm:hidden'
            action={handleEdit}
            icon={<RiEditLine />}
            title='Edit title'
          />
        </div>

        <div className='flex items-center gap-1'>
            <ButtonWithIcon
              action={openModal}
              title='Add stage'
              icon={<BiPlus/>}
            />
            <ButtonWithIcon
              action={handleDeleteProject}
              title='Delete project'
              icon={<HiOutlineTrash />}
            />

            <ButtonWithIcon
              disabled={noMorePrev}
              disabledStyles={disabledStyles}
              action={movePrev}
              additionalStyles='py-1 px-2'
              title='Previous stage'
              icon={<HiMiniChevronLeft />}
            />
            <ButtonWithIcon
              disabled={noMoreNext}
              disabledStyles={disabledStyles}
              action={moveNext}
              additionalStyles='py-1 px-2'
              title='Next stage'
              icon={<HiMiniChevronRight />}
            />
        </div>
    </div>

    <Line additionalStyles='my-2' />
    </>
  )
}

export default DashboardTop;