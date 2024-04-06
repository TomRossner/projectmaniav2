import { useAppDispatch } from '@/hooks/hooks';
import { IProject, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
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

    const handleSelectProject = async (): Promise<void> => {
      dispatch(setCurrentProject(project));
    }

    const displayStagesCount = (): string => {
      return stages.length
        ? `${stages.length} stage${(stages.length > 1) || (stages.length === 0) ? 's' : ''}`
        : `0 stages`;
    }

    const displayTotalTasks = (): string => {
      const totalTasks = stages.reduce((total, stage) => total + stage.tasks.length, 0);

      return `${totalTasks} task${(totalTasks > 1) || (totalTasks === 0) ? 's' : ''}`;
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
            {displayStagesCount()}

            <span className='flex text-[4px] pb-1 text-slate-500'>
              <BsCircleFill />
            </span>

            {displayTotalTasks()}
          </p>
      </div>
    </Link>
  )
}

export default ProjectItem;