'use client'

import React from 'react';
import isAuth from '../ProtectedRoute';
import Header from '@/components/common/Header';
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import ProjectsList from '@/components/ProjectsList';
import Container from '@/components/common/Container';
import useProjects from '@/hooks/useProjects';
import useModals from '@/hooks/useModals';

const Projects = () => {
  const {projects} = useProjects();
  const {openNewProjectModal} = useModals();
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // const handleCreateProject = async () => {
  //   setIsLoading(true);
    
  //   try {
  //     const self: TeamMember = {
  //       email: user?.email,
  //       userId: user?.userId,
  //       firstName: user?.firstName,
  //       lastName: user?.lastName
  //     } as TeamMember;
  
  //     const newProject = {
  //       title: `${user?.firstName}'s Project`,
  //       team: [self],
  //       stages: [DEFAULT_STAGE]
  //     }
  
  //     return await createProject(newProject);
  //   } catch (error: unknown) {
  //     handleError(error as AxiosError);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleNewProject = () => {
    openNewProjectModal();
  }

  return (
    <Container id='projectsPage'>
      <div className='flex items-center justify-between w-full'>
        <Header text='Projects' />

        <ButtonWithIcon
          withTooltip
          title='New project'
          action={handleNewProject}
          icon={<BiPlus />}
        />
      </div>

      <ProjectsList projects={projects} />
    </Container>
  )
}

export default isAuth(Projects);