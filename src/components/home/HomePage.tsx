import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import { IUser } from '@/store/auth/auth.slice';
import { getProject } from '@/services/projects.api';
import { getUserNotifications } from '@/services/notifications.api';
import MostRecentProject from './MostRecentProject';
import RecentProjects from './RecentProjects';
import { useAppDispatch } from '@/hooks/hooks';
import { IProject } from '@/store/projects/projects.slice';
import { setNotifications } from '@/store/notifications/notifications.slice';
import useProjects from '@/hooks/useProjects';
import Loading from '../common/Loading';

interface HomePageProps {
  user: IUser;
  userId: string;
}

const HomePage = ({ user, userId }: HomePageProps) => {
  const dispatch = useAppDispatch();
  const [mostRecentProject, setMostRecentProject] = useState<IProject | null>(null);
  const {isFetching, projects} = useProjects();

  useEffect(() => {
    if (userId) {
      if (!mostRecentProject && !!user.mostRecentProject) {
        console.log("Fetching most recent project...");
        getProject(user.mostRecentProject?.projectId as string)
          .then(res => setMostRecentProject(res.data))
          .catch(err => console.error(err));
      }
  
      getUserNotifications(userId)
        .then(res => dispatch(setNotifications(res.data)))
        .catch(err => console.error(err));
    }
  }, [userId])

  return (
    <>
      <Header text={`Welcome back ${user?.firstName}`} />

      {isFetching && !projects?.length && (
        <Loading withText text='Loading...' textStyles='items-center' />
      )}

      {!isFetching && (
        <>
          {!!user?.mostRecentProject && (
            <MostRecentProject
              mostRecentProject={mostRecentProject}
            />
          )}

          <RecentProjects />
        </>
      )}
    </>
  )
}

export default HomePage;