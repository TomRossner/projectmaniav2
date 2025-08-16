'use client';

import { useAppDispatch } from '@/hooks/hooks';
import { IProject, TeamMember, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import { BsCircleFill } from 'react-icons/bs';
import { getStagesCount, getTotalTasks } from '@/utils/utils';
import { twMerge } from 'tailwind-merge';
import MostRecentProjectSkeleton from '../skeletons/MostRecentProjectSkeleton';
import ImageWithFallback from '../common/ImageWithFallback';

interface MostRecentProjectProps {
  mostRecentProject: IProject | null;
}

const MostRecentProject = ({mostRecentProject}: MostRecentProjectProps) => {
  const dispatch = useAppDispatch();

  const handleSelectProject = () => {
    dispatch(setCurrentProject(mostRecentProject));
  };

  const getFirstTeamMembers = (members: TeamMember[], count: number): TeamMember[] => {
    return [...members].filter((_, i) => i <= count);
  };

  const calculateTeamMembersLeft = (members: TeamMember[], from: number): number => {
    return [...members].filter((_, i) => i > from).length;
  };

  return mostRecentProject ? (
    <Link
      href={`${LINKS['PROJECTS']}/${mostRecentProject.projectId}`}
      onClick={handleSelectProject}
      className="w-full flex flex-col sm:hover:scale-[1.01] transition-all p-4 rounded-bl-lg shadow-sm hover:shadow-lg h-32 bg-blue-100"
    >
      <h4 className="text-2xl font-medium text-blue-500">{mostRecentProject.title}</h4>
      <div className="grow" />
      <p className="text-md text-blue-400 px-1 flex items-center gap-2">
        {getStagesCount(mostRecentProject.stages)}
        <BsCircleFill className="w-1 pb-1" />
        {getTotalTasks(mostRecentProject.stages)}
      </p>
      <div className="flex items-center gap-2 w-full">
        <p className="text-md text-blue-400 px-1 flex w-fit relative h-9">
          {getFirstTeamMembers(mostRecentProject.team, 3).map((u, idx) => (
            u.imgSrc ? (
              <ImageWithFallback
                key={u.userId}
                src={u.imgSrc}
                alt={''}
                width={28}
                height={28}
                className={twMerge(`rounded-full w-8 h-8 bg-white`)}
                style={{ translate: -(idx * 10) }}
              />
            ) : (
              <span
                key={u.userId}
                className={twMerge(`inline-flex items-center justify-center rounded-full w-8 h-8 font-light border bg-white text-stone-300`)}
                style={{ translate: -(idx * 10) }}
              >
                {u.firstName.charAt(0)}{u.lastName.charAt(0)}
              </span>
            )
          ))}
        </p>
        {mostRecentProject.team.length > 3 && (
          <span className="z-10 grow text-blue-400 sm:hover:text-blue-500" style={{ translate: -25 }}>
            + {calculateTeamMembersLeft(mostRecentProject.team, 3)} more
          </span>
        )}
      </div>
    </Link>
  ) : <MostRecentProjectSkeleton />;
};

export default MostRecentProject;
