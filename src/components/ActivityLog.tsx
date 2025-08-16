import useModals from '@/hooks/useModals';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import { RxCross2 } from 'react-icons/rx';
import Header from './common/Header';
import BackLayer from './common/BackLayer';
import Line from './common/Line';
import ActivityItem from './Activity';
import useActivityLog from '@/hooks/useActivityLog';
import Button from './common/Button';
import { useAppDispatch } from '@/hooks/hooks';
import { fetchActivityLogAsync } from '@/store/activity_log/activity_log.slice';
import useProjects from '@/hooks/useProjects';
import { DEFAULT_ACTIVITY_FETCH_LIMIT } from '@/utils/constants';
import Loading from './common/Loading';
import { twMerge } from 'tailwind-merge';

const ActivityLog = () => {
    const {isActivityLogOpen, closeActivityLog} = useModals();
    const {activities, page, isLoading} = useActivityLog();
    const dispatch = useAppDispatch();
    const {projectId} = useProjects();

    const activitiesListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isLoading && activities.length) {
            activitiesListRef.current?.scrollTo({
                top: activitiesListRef.current.scrollHeight - 100, // NEEDS FIX - DOES NOT WORK
                behavior: 'smooth'
            });
        }
    }, [isLoading])

  return (
    <AnimatePresence>
        {isActivityLogOpen && (
            <BackLayer
                title=''
                action={closeActivityLog}
                zIndex='30'
            >
                <motion.div
                    initial={{
                        translateX: '100%',
                    }}
                    animate={{
                        translateX: 0,
                        transition: {
                            duration: 0.1
                        }
                    }}
                    exit={{
                        translateX: '100%',
                        transition: {
                            duration: 0.1
                        }
                    }}
                    className='w-[90%] bg-white p-4 flex flex-col gap-2 grow z-40 absolute border-l border-l-slate-400 top-0 right-0 h-full'
                >
                    <div className='flex w-full justify-between items-start'>
                        <Header text='Activity log' />

                        <ButtonWithIcon
                            icon={<RxCross2 />}
                            title='Close activity log'
                            withTooltip={false}
                            action={closeActivityLog}
                        />
                    </div>

                    <Line />

                    {isLoading && !activities.length && (
                        <Loading withText text='Loading activity log...'/>
                    )}

                    {!!activities?.length
                        ? (
                            <>
                                <div ref={activitiesListRef} className={twMerge(`flex flex-col gap-2 overflow-y-auto overflow-x-hidden ${isLoading && 'opacity-55'}`)}>
                                    {activities.map(a => (
                                        <ActivityItem activity={a} key={a.activityId} />
                                    ))}

                                    <div className={twMerge(`flex items-center justify-center w-full ${isLoading ? 'h-fit' : 'h-0'}`)}>
                                        {isLoading && (
                                            <Loading imageStyles='my-0' width={30} height={30} />
                                        )}
                                    </div> 
                                </div>

                                <Line />
                                
                                <Button
                                    action={() => dispatch(fetchActivityLogAsync({
                                        projectId: projectId as string,
                                        page,
                                        limit: DEFAULT_ACTIVITY_FETCH_LIMIT
                                    }))}
                                    type='button'
                                    additionalStyles='self-start border-none text-blue-400 sm:hover:text-blue-500 active:text-blue-500 w-fit'
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Show more...'}
                                </Button>
                            </>
                        ) : (
                            <>
                            {!isLoading && (
                                <p className='text-2xl text-stone-700 font-semibold flex justify-center items-center grow'>
                                    There are no activities.
                                </p>
                            )}
                            </>
                        )
                    }
                </motion.div>
            </BackLayer>
        )}
    </AnimatePresence>
  )
}

export default ActivityLog;