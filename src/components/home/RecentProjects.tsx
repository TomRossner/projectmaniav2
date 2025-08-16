'use client'

import { IUser } from '@/store/auth/auth.slice';
import { IProject, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import { setProjectLink } from '@/utils/utils';
import Link from 'next/link';
import React, { Fragment, useEffect } from 'react';
import Button from '../common/Button';
import { openModal } from '@/store/modals/modals.slice';
import { useAppDispatch } from '@/hooks/hooks';
import useProjects from '@/hooks/useProjects';
import useAuth from '@/hooks/useAuth';

type RecentProjectsProps = {
    projects: IProject[];
    user: IUser | null;
    isFetching: boolean;
}

const RecentProjects = () => {
    const dispatch = useAppDispatch();
    const {getPaginatedProjects, projects, isFetching} = useProjects();
    const {userId} = useAuth();

    useEffect(() => {
      if (userId && !projects.length) {
        console.log("Fetching projects...")
        getPaginatedProjects(userId as string);
      }
    }, [projects, userId])

  return (
    <>
        {!!projects?.length
            ? (
              <div className='w-full flex flex-col'>
                <h3 className='text-xl font-medium text-stone-800 text-left w-full flex items-center justify-between mt-4'>
                  Recent projects
                  <Link
                    href={{
                      pathname: LINKS.PROJECTS,
                      query: {
                        userId
                      }
                    }}
                    className='font-normal text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
                  >
                    See all
                  </Link>
                </h3>
                <div className='w-full flex flex-col px-3 py-2 bg-slate-100 rounded-bl-lg'>
                  {projects.map(p => (
                    <Fragment key={p.projectId}>
                      <Link
                        href={setProjectLink(p.projectId)}
                        onClick={() => dispatch(setCurrentProject(p))}
                        className='text-blue-400 w-full cursor-pointer sm:hover:text-blue-500 active:text-blue-500 font-light'
                      >
                        {p.title}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className='w-full flex flex-col items-center justify-center gap-5 mt-24'>
                {!isFetching && (
                  <>
                    <p className='w-full text-center'>You do not have any projects</p>
                    <Button
                      action={() => dispatch(openModal("newProject"))}
                      type='button'
                      additionalStyles='rounded-bl-lg bg-blue-400 sm:hover:bg-blue-500 active:bg-blue-500 text-white border-none w-1/2 mx-auto'
                    >
                      Create one
                    </Button>
                  </>
                )}
              </div>
            )
        }
    </>
  )
}

export default RecentProjects;