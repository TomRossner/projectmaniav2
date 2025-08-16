import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import { IProject, setCurrentProject, setProjects } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { getStagesCount, getTotalTasks, prepend } from '@/utils/utils';
import Link from 'next/link';
import React from 'react';
import { BsCircleFill } from 'react-icons/bs';

const ProjectItem = (project: IProject) => {
    const {
        projectId,
        stages,
        team,
        title,
        subtitle
    } = project;

    const dispatch = useAppDispatch();
    const {projects} = useProjects();
    const handleSelectProject = async (): Promise<void> => {
      dispatch(setCurrentProject(project));
      // dispatch(setProjects(prepend(project, projects.filter(p => p.projectId !== projectId))));
    }

  return (
    <Link
      href={`${LINKS['PROJECTS']}/${projectId}`}
      onClick={handleSelectProject}
    >
      <div className='border rounded-bl-lg px-5 py-3 w-full hover:border-blue-500 hover:bg-slate-100 hover:shadow-md transition-all'>
          <p>
            <span className='text-2xl font-semibold text-stone-700'>
              {title}
            </span>
          </p>

          <p className='flex items-center gap-2 text-slate-600 font-medium italic'>
            {getStagesCount(stages)}

            <span className='flex text-[4px] pb-1 text-slate-500'>
              <BsCircleFill />
            </span>

            {getTotalTasks(stages)}
          </p>
      </div>
    </Link>
  )
}

export default ProjectItem;