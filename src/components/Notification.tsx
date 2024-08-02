import React from 'react'
import Line from './common/Line';
import Button from './common/Button';
import { twMerge } from 'tailwind-merge';
import { capitalizeFirstLetter } from '@/utils/utils';
import { BsCircleFill } from 'react-icons/bs';
import { NotificationType, Sender } from '@/utils/types';
import useNotifications from '@/hooks/useNotifications';
import { useAppDispatch } from '@/hooks/hooks';
import { setNotifications } from '@/store/notifications/notifications.slice';
import { INotification } from '@/utils/interfaces';
import { DateTime as dt} from "luxon";
import { updateNotificationIsSeen } from '@/services/notifications.api';
import { AnimatePresence, motion } from 'framer-motion';

type NotificationProps = {
    notification: INotification;
    withDenyBtn?: boolean;
    denyBtnText?: string;
    btnText?: string;
    action: () => void;
    onDeny: () => void;
}

const Notification = ({
    notification,
    withDenyBtn = true,
    action,
    onDeny
}: NotificationProps) => {
    const {
        type,
        sender,
        recipient,
        isSeen,
        data,
        createdAt
    } = notification as INotification;

    const {notifications, isProject} = useNotifications();

    const dispatch = useAppDispatch();

    const handleClick = () => {
        if (action) action();
    }

    const getTitle = (type: NotificationType): string => {
        return capitalizeFirstLetter(type as string);
    }

    const getSenderUserName = (sender: Sender): string => {
        return `${sender.firstName} ${sender.lastName}`;
    }

    const updateIsSeen = async () => {
        if (isSeen) return;
        
        const updatedNotification: INotification = {
            ...notification,
            isSeen: true,
        }

        const updatedNotifications: INotification[] = [
            ...notifications.map(n => n.id === notification.id ? updatedNotification : n)
        ]

        dispatch(setNotifications(updatedNotifications));

        await updateNotificationIsSeen(notification.id, true);
    }

    
    const getHowLongAgo = (date: Date): string => {
        const howLongAgo = dt
            .fromISO(date.toString())
            .toRelative();
        
        return howLongAgo?.startsWith('0')
            ? 'Just now'
            : howLongAgo as string;
    }

  return (
    <AnimatePresence>
        {notification && (
            <motion.div
                initial={{
                    scale: 0.1,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 100,
                    transition: {
                        duration: 0.2,
                        ease: "easeIn"
                    }
                }}
                onMouseLeave={updateIsSeen}
                className={twMerge(`border flex rounded-bl-lg gap-1 border-b-4 border-slate-500 px-2 py-1 items-start flex-col w-full ${isSeen ? 'bg-slate-50' : 'bg-blue-100' }`)}
            >
                <h3 className='text-xl w-full font-semibold text-stone-700 flex items-start justify-between'>
                    {getTitle(type)}
                    <span className={`text-[10px] ${isSeen ? 'text-slate-400' : 'text-blue-400'} pt-1`}>
                        <BsCircleFill />
                    </span>
                </h3>

                <Line additionalStyles='border-stone-400' />
                
                <p>
                    <b>{getSenderUserName(sender)}</b>
                    {type === "friendRequest" && ' has sent you a friend request'}
                    {type === "invitation" && <span> has invited you to join <b>{type === "invitation" && isProject(data) && data?.title}</b></span>}
                    {type ==="message" && <span> sent you a message</span>}.
                </p>

                <div className='flex w-full gap-2 items-center'>
                    <Button action={handleClick} additionalStyles='bg-blue-400 text-white rounded-bl-lg border-blue-400 w-fit py-0 sm:hover:bg-blue-500 active:bg-blue-500' type='button'>
                        {type === "invitation" && 'Join'}
                        {type === "friendRequest" && 'Accept'}
                        {type === "message" && 'Show message'}
                    </Button>

                    {withDenyBtn && (
                        <Button
                            type='button'
                            action={onDeny}
                            additionalStyles='w-fit py-0 bg-slate-50 border-stone-300 text-stone-500 sm:hover:text-stone-700 sm:hover:border-stone-400 active:border-stone-400 sm:hover:bg-slate-100 active:bg-slate-100 active:text-stone-700'
                        >
                            Deny
                        </Button>
                    )}

                    <p className='grow text-end text-stone-400 px-1'>{getHowLongAgo(createdAt)}</p>
                </div>

            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default Notification;      