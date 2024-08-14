import useModals from '@/hooks/useModals';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import Input from '../common/Input';
import { IUser } from '@/store/auth/auth.slice';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { getUsersByQuery } from '@/services/user.api';
import useAuth from '@/hooks/useAuth';
import isAuth from '@/app/ProtectedRoute';
import { GoSearch } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';
import useProjects from '@/hooks/useProjects';
import { IProject } from '@/store/projects/projects.slice';
import { Sender, Recipient } from '@/utils/types';
import { INotification, NewNotificationData } from '@/utils/interfaces';
import Avatar from '../common/Avatar';
import { createNotification } from '@/services/notifications.api';
import { twMerge } from 'tailwind-merge';
import { getSocket } from '@/utils/socket';

const InvitationModal = () => {
    const {user, getUserName, getUserInitials, userId} = useAuth();
    const {isInvitationModalOpen, closeInvitationModal} = useModals();
    const {currentProject} = useProjects();
    const socket = getSocket();

    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const isDirty = useMemo(() => !!searchQuery, [searchQuery]);

    const memoizedResults = useMemo(() => searchResults
        .filter(res => res.userId !== user?.userId)
        .map(res => ({
            userId: res.userId,
            userName: getUserName(res),
            imgSrc: res.imgSrc
        })
    ), [searchResults, user, getUserName]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClose = () => {
        setSearchQuery("");
        closeInvitationModal();
    }

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const {value} = ev.target;

        setSearchQuery(value);
    }

    const handleQuery = async (query: string) => {
        return await getUsersByQuery(query);
    }

    const handleSendInvitation = async (recipient: Recipient) => {
        const recipientAsUser = searchResults.find(u => u.userId === recipient.userId) as IUser;

        if (!recipientAsUser) return;
        // Set error

        const projectData = {
            title: currentProject?.title,
            projectId: currentProject?.projectId,
        } as Pick<IProject, "projectId" | "title">;

        const notificationData: NewNotificationData = {
            data: projectData,
            type: "invitation",
            recipient: {
                userId: recipient?.userId,
                firstName: recipient?.firstName,
                lastName: recipient?.lastName
            },
            sender: {
                userId: user?.userId,
                firstName: user?.firstName,
                lastName: user?.lastName
            } as Sender,
        }

        const {data: notification} = await createNotification(notificationData);

        socket?.emit("notification", notification as INotification);
    }

    const isAlreadyATeamMember = (userId: string): boolean => {
        return !!currentProject && currentProject?.team.some(u => u.userId === userId);
    }
 
    useEffect(() => {
        if (isInvitationModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInvitationModalOpen])


    useEffect(() => {
        if (isDirty) {
            handleQuery(searchQuery)
                .then(res => setSearchResults(res.data))
                .catch(e => console.error(e));
        } else setSearchResults([]);
    }, [searchQuery, isDirty])

  return (
    <Modal
        isOpen={isInvitationModalOpen}
        title='Project invitation'
        onClose={handleClose}
        withCrossIcon
        withSubmitBtn={false}
        withCloseBtn={false}
    >
        {/* <p className='text-gray-500'></p> */}

        <Input
            type='text'
            id='search'
            name='search'
            additionalStyles='pl-1'
            onChange={handleChange}
            placeholder='Search...'
            value={searchQuery}
            ref={inputRef}
            searchIcon={<GoSearch />}
            withIconInsideInput
            inputIcon={
                <ButtonWithIcon
                    withTooltip={false}
                    icon={<RxCross2 />}
                    action={() => setSearchQuery("")}
                    additionalStyles="border-none h-full"
                />
            }
        />
        
        {isDirty && (
            <p className='flex w-full justify-between items-center px-1 mt-2'>
                <span>Search results</span>
                <span>{memoizedResults.length} result{memoizedResults.length === 1 ? '' : 's'} found</span>
            </p>
        )}

        <div className='w-full flex flex-col gap-1'>
            {!!memoizedResults.length && (
                memoizedResults.map(res => (
                    <div key={res.userId} className={twMerge(`flex gap-2 w-full items-center border p-2 bg-slate-50 ${isAlreadyATeamMember(res.userId) && 'opacity-50 cursor-not-allowed'}`)}>
                        <div className='flex items-center gap-2 grow'>
                            <Avatar
                                src={res.imgSrc}
                                text={getUserInitials(res.userName)}
                                additionalStyles='w-7 h-7'
                            />

                            <p className='text-lg'>
                                {res.userName}
                            </p>
                        </div>

                        <ButtonWithIcon
                            icon={<MdOutlinePersonAddAlt />}
                            title='Send invitation'
                            disabled={isAlreadyATeamMember(res.userId)}
                            action={() => handleSendInvitation(searchResults.find(u => u.userId === res.userId) as IUser)}
                        />
                    </div>
                ))
            )}
        </div>
    </Modal>
  )
}

export default isAuth(InvitationModal);