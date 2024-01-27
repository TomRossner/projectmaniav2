import { useAppSelector } from './hooks';
import { selectProjectsSlice } from '@/store/projects/projects.selectors';

const useProjects = () => {
    const {
      projects,
      currentProject,
      currentStage,
      currentTask,
      isFetching,
      stages,
      tasks,
      currentStageIndex
    } = useAppSelector(selectProjectsSlice);

  return {
    projects,
    currentProject,
    currentStage,
    currentTask,
    isFetching,
    stages,
    tasks,
    currentStageIndex
  }
}

export default useProjects;