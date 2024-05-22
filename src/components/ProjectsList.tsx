import { IProject } from '@/store/projects/projects.slice';
import React from 'react';
import ProjectItem from './ProjectItem';

type List = {
  projects: IProject[];
}

const ProjectsList = ({projects = []}: List) => {
    
  return (
    <div id='projectsContainer' className='my-4 grid gap-2'>
        {!!projects.length
          ? projects?.map(p =>
            <ProjectItem
                key={p.projectId}
                {...p}
            />
          ) : (
              <p className='text-center w-full font-medium text-gray-400'>No projects</p>
          )
        }
    </div>
  )
}

export default ProjectsList;