'use client'

import React, { useMemo, useState } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import useProjects from '@/hooks/useProjects';
import { HiMiniChevronLeft, HiMiniChevronRight } from 'react-icons/hi2';
import ProjectTitle from './ProjectTitle';
import Line from './common/Line';
import { BiPlus } from 'react-icons/bi';
import { useAppDispatch } from '@/hooks/hooks';
import { openDeleteProjectPrompt, openEditProjectModal, openNewStageModal } from '@/store/app/app.slice';
import { twMerge } from 'tailwind-merge';
import { BsThreeDots } from 'react-icons/bs';
import { PROJECT_MENU_OPTIONS } from '@/utils/constants';
import MoreOptions from './common/MoreOptions';
import { TOption } from '@/utils/types';
import { GoSearch } from "react-icons/go";
import { ITask } from '@/store/projects/projects.slice';
import SearchModal from './modals/SearchModal';

interface IDashboardTopProps {
  moveNext: () => void;
  movePrev: () => void;
  noMoreNext: boolean;
  noMorePrev: boolean;
}

const DashboardTop = ({moveNext, movePrev, noMoreNext, noMorePrev}: IDashboardTopProps) => {
    const {currentProject} = useProjects();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const tasks = useMemo(() =>currentProject?.stages.flatMap(s => s.tasks), [currentProject]);

    const openModal = (): void => {
      dispatch(openNewStageModal());
    }
    
    const handleDeleteProject = (): void => {
      dispatch(openDeleteProjectPrompt());
    }

    const handleEdit = (): void => {
      dispatch(openEditProjectModal());
    }

    const toggleProjectMenu = () => {
      setMenuOpen(!menuOpen);
    }

    const openActivityLog = () => {
      console.log("This will be sick");
    }

    const handleOpt = (opt: TOption): void => {
      setMenuOpen(false);

      switch (opt.text.toLowerCase()) {
        case "delete":
          return handleDeleteProject();
        case "activity log":
          return openActivityLog();
        case "edit":
          return handleEdit();
        default:
          return setMenuOpen(false);
      }
    }

    const toggleInputVisibility = (): void => {
      setIsSearchModalOpen(!isSearchModalOpen);
    }
    
  return (
    <>
      <SearchModal
        isOpen={isSearchModalOpen}
        setIsOpen={setIsSearchModalOpen}
        tasks={tasks as ITask[]}
      />

      {currentProject && (
        <>
          <div className='flex items-center justify-between w-full group relative'>
              <div className='flex items-center gap-3 hover:nth w-full justify-between'>
                <ProjectTitle
                  title={currentProject?.title as string}
                  subtitle={currentProject?.subtitle}
                />
      
                {/* <ButtonWithIcon
                  additionalStyles='group-hover:flex sm:hidden'
                  action={handleEdit}
                  icon={<RiEditLine />}
                  title='Edit title'
                /> */}
                <div className='flex items-center gap-1 justify-end'>
                    <ButtonWithIcon
                      action={openModal}
                      title='Add stage'
                      icon={<BiPlus />}
                    />
                    <ButtonWithIcon
                      title='Search'
                      action={toggleInputVisibility}
                      additionalStylesForState={'hidden'}
                      state={isSearchModalOpen}
                      icon={<GoSearch />}
                    />
                    {/* <ButtonWithIcon
                      action={handleDeleteProject}
                      title='Delete project'
                      icon={<HiOutlineTrash />}
                    /> */}
        
                    <ButtonWithIcon
                      disabled={noMorePrev}
                      disabledStyles={twMerge(`
                        disabled:border-slate-200
                        disabled:text-slate-200
                        disabled:hover:border-slate-200
                        disabled:hover:text-slate-200
                        disabled:cursor-default
                        ${(currentProject!.stages.length <= 2) && 'sm:hidden'}
                      `)
                      }
                      action={movePrev}
                      additionalStyles='py-1 px-2'
                      title='Previous stage'
                      icon={<HiMiniChevronLeft />}
                    />
                    <ButtonWithIcon
                      disabled={noMoreNext}
                      disabledStyles={twMerge(`
                        disabled:border-slate-200
                        disabled:text-slate-200
                        disabled:hover:border-slate-200
                        disabled:hover:text-slate-200
                        disabled:cursor-default
                        ${(currentProject!.stages.length <= 2) && 'sm:hidden'}
                      `)
                      }
                      action={moveNext}
                      additionalStyles='py-1 px-2'
                      title='Next stage'
                      icon={<HiMiniChevronRight />}
                    />

                    <ButtonWithIcon
                      action={toggleProjectMenu}
                      title='More options'
                      icon={<BsThreeDots />}
                    />

                    <MoreOptions
                      options={PROJECT_MENU_OPTIONS}
                      isOpen={menuOpen}
                      setIsOpen={setMenuOpen}
                      action={handleOpt}
                    />
                </div>
              </div>
      
          </div>
      
          <Line additionalStyles='my-2' />
        </>
      )}
    </>
  )
}

export default DashboardTop;