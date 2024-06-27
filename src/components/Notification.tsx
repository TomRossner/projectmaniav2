import { IUser } from '@/store/auth/auth.slice';
import React from 'react'
import Line from './common/Line';
import Button from './common/Button';
import { twMerge } from 'tailwind-merge';
import { IProject } from '@/store/projects/projects.slice';
import { capitalizeFirstLetter } from '@/utils/utils';
import { BsCircleFill } from 'react-icons/bs';

type NotificationType = 'invitation' | 'update' | 'new message' | 'friend request' | 'joined project';

export type TNotification = {
    type: NotificationType;
    from: Pick<IUser, "userId" | "firstName" | "lastName">;
    to: Pick<IUser, "userId">;
    id: string;
    isSeen: boolean;
    projectData?: Pick<IProject, "projectId" | "title">;
    messageData?: Message;
}

type Message = {
    from: Pick<IUser, "userId" | "firstName" | "lastName">;
    to: Pick<IUser, "userId">;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

type NotificationProps = {
    notification: TNotification;
    withDenyBtn?: boolean;
    denyBtnText?: string;
    btnText?: string;
}

const Notification = ({notification, withDenyBtn = true}: NotificationProps) => {
    const {
        type,
        from,
        to,
        isSeen,
        projectData,
        messageData,
    } = notification as TNotification;

    const handleClick = () => {

    }

    const getTitle = (type: string): string => {
        return capitalizeFirstLetter(type);
    }
    
  return (
    <div className={twMerge(`border flex rounded-bl-lg gap-1 border-b-4 border-slate-500 px-2 py-1 items-start flex-col w-full ${isSeen ? 'bg-slate-50' : 'bg-blue-100' }`)}>
        <h3 className='text-xl w-full font-semibold text-stone-700 flex items-start justify-between'>
            {getTitle(type)}
            <span className={`text-[10px] ${isSeen ? 'text-slate-400' : 'text-blue-400'} pt-1`}>
                <BsCircleFill />
            </span>
        </h3>

        <Line additionalStyles='border-stone-400' />
        
        <p className=''>
            <b>{from?.firstName} {from?.lastName}</b>
            {type === "friend request" && ' has sent you a friend request'}
            {type === "invitation" && <span> has invited you to join <b>{projectData?.title as string}</b></span>}
            {type ==="new message" && <span> sent you a message</span>}.
        </p>

        <div className='flex w-full gap-2 items-center'>
            <Button action={handleClick} additionalStyles='bg-blue-400 text-white rounded-bl-lg border-blue-400 w-fit py-0 sm:hover:bg-blue-500 active:bg-blue-500' type='button'>
                {type === "invitation" && 'Join'}
                {type === "friend request" && 'Accept'}
                {type === "new message" && 'Show message'}
            </Button>

            {withDenyBtn && (
                <Button
                    type='button'
                    additionalStyles='w-fit py-0 bg-slate-50 border-stone-300 text-stone-500 sm:hover:text-stone-700 sm:hover:border-stone-400 active:border-stone-400 sm:hover:bg-slate-100 active:bg-slate-100 active:text-stone-700'
                >
                    Deny
                </Button>
            )}
        </div>
    </div>
  )
}

export default Notification;      