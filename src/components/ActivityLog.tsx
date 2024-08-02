import useModals from '@/hooks/useModals';
import useProjects from '@/hooks/useProjects';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import ButtonWithIcon from './common/ButtonWithIcon';
import { RxCross2 } from 'react-icons/rx';
import Header from './common/Header';
import BackLayer from './common/BackLayer';
import Line from './common/Line';
import ActivityItem from './Activity';
import useActivityLog from '@/hooks/useActivityLog';
import { useAppDispatch } from '@/hooks/hooks';
import { fetchActivityLogAsync } from '@/store/activity_log/activity_log.slice';

const ActivityLog = () => {
    const {currentProject} = useProjects();
    const {isActivityLogOpen, closeActivityLog} = useModals();
    const {activities} = useActivityLog();

  return (
    <AnimatePresence>
        {isActivityLogOpen && (
            <BackLayer
                title=''
                closeOnClick
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

                    {!!activities?.length
                        ? (
                            <div className='flex flex-col gap-2 overflow-y-auto overflow-x-hidden'>
                                {activities.map(a => (
                                    <ActivityItem activity={a} key={a.activityId} />
                                ))}
                            </div>
                        ) : (
                            <p className='text-2xl text-stone-700 font-semibold flex justify-center items-center grow'>
                                There are no activities.
                            </p>
                        )
                    }
                </motion.div>
            </BackLayer>
        )}
    </AnimatePresence>
  )
}

export default ActivityLog;