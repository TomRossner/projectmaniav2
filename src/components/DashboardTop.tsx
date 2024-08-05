'use client'

import React, { useCallback, useMemo, useState } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import useProjects from '@/hooks/useProjects';
import { HiMiniChevronLeft, HiMiniChevronRight } from 'react-icons/hi2';
import ProjectTitle from './ProjectTitle';
import Line from './common/Line';
import { BiPlus } from 'react-icons/bi';
import { useAppDispatch } from '@/hooks/hooks';
import { twMerge } from 'tailwind-merge';
import { BsThreeDots } from 'react-icons/bs';
import { PROJECT_MENU_OPTIONS } from '@/utils/constants';
import MoreOptions from './common/MoreOptions';
import { ActivityType, TOption } from '@/utils/types';
import { GoSearch } from "react-icons/go";
import { IProject, ITask } from '@/store/projects/projects.slice';
import SearchModal from './modals/SearchModal';
import useAuth from '@/hooks/useAuth';
import { IUser } from '@/store/auth/auth.slice';
import useModals from '@/hooks/useModals';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import useActivityLog from '@/hooks/useActivityLog';

type DashboardTopProps = {
  moveNext: () => void;
  movePrev: () => void;
  noMoreNext: boolean;
  noMorePrev: boolean;
}

const DashboardTop = ({moveNext, movePrev, noMoreNext, noMorePrev}: DashboardTopProps) => {
    const {currentProject, tasks, handleLeaveProject} = useProjects();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const {user, isAuthenticated, userId} = useAuth();
    const {openNewStageModal, openDeleteProjectModal, openEditProjectModal, openInvitationModal, openActivityLog} = useModals();
    const {createNewActivity, activities} = useActivityLog();

    const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const openModal = (): void => {
      openNewStageModal();
    }
    
    const handleDeleteProject = (): void => {
      openDeleteProjectModal();
    }

    const handleEdit = (): void => {
      openEditProjectModal();
    }

    const toggleProjectMenu = () => {
      setMenuOpen(!menuOpen);
    }

    const openActivity = () => {
      openActivityLog();
    }

    const handleOpenInvitationModal = () => {
      openInvitationModal();
    }

    const handleLeave = useCallback(async (projectId: string) => {
      if (
        (currentProject?.team.length === 1) &&
        (currentProject.team[0].userId === user?.userId)
      ) {
        return;
      }
      
      const activityLog =  await createNewActivity(
        ActivityType.LeaveProject,
        user as IUser,
        currentProject as IProject,
        currentProject?.projectId as string
      );

      dispatch(setActivities([
        ...activities,
        activityLog
      ]));

      handleLeaveProject(projectId, userId as string);
    }, [
      currentProject,
      activities,
      createNewActivity,
      user,
      userId,
      dispatch,
      handleLeaveProject
    ]);

    const handleOpt = async (opt: TOption): Promise<void> => {
      setMenuOpen(false);

      switch (opt.text.toLowerCase()) {
        case "delete":
          return handleDeleteProject();
        case "activity log":
          return openActivity();
        case "edit":
          return handleEdit();
        case "invite":
          return handleOpenInvitationModal();
        case "leave project":
          return handleLeave(currentProject?.projectId as string);
        default:
          return setMenuOpen(false);
      }
    }

    const toggleInputVisibility = () => {
      setIsSearchModalOpen(!isSearchModalOpen);
    }

    const projectMenuOptions: string[] = useMemo(() => {
      if (isAuthenticated && ((user?.userId === currentProject?.createdBy))) {
        return ((currentProject?.team.length === 1) && (currentProject.team[0].userId === userId))
          ? [...PROJECT_MENU_OPTIONS.filter(o => o !== 'Leave project')]
          : PROJECT_MENU_OPTIONS;
      }
      
      return PROJECT_MENU_OPTIONS.filter(o => o !== 'Delete');
    }, [currentProject, userId, user, isAuthenticated]);
    
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
                      options={projectMenuOptions}
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