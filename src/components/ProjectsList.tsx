import { IProject } from '@/store/projects/projects.slice';
import React from 'react';
import ProjectItem from './ProjectItem';

type List = {
    projects: IProject[];
}

const ProjectsList = ({projects = []}: List) => {
    
  return (
    <div id='projectsContainer' className='my-4 grid gap-2'>
        {projects?.map(p =>
            <ProjectItem
                key={p.projectId}
                {...p}
            />
        )}
    </div>
  )
}

export default ProjectsList;