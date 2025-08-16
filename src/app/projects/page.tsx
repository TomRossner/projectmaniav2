'use client'

import React, { useEffect } from 'react';
import isAuth from '../ProtectedRoute';
import Header from '@/components/common/Header';
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import ProjectsList from '@/components/ProjectsList';
import Container from '@/components/common/Container';
import useProjects from '@/hooks/useProjects';
import useModals from '@/hooks/useModals';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/hooks/hooks';

const ProjectsPage = () => {
  const {projects, isFetching, getAllProjects} = useProjects();
  const {openNewProjectModal} = useModals();
  const {userId} = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      getAllProjects(userId);
    }
  }, [userId])

  return (
    <Container id='projectsPage'>
      <div className='flex items-center justify-between w-full'>
        <Header text='Projects' />

        <ButtonWithIcon
          withTooltip
          title='New project'
          action={openNewProjectModal}
          icon={<BiPlus />}
        />
      </div>

      {isFetching ? <Loading withText text='Loading projects...' /> : <ProjectsList projects={projects} />}
    </Container>
  )
}

export default isAuth(ProjectsPage);