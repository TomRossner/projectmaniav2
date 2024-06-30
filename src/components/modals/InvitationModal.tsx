import useModals from '@/hooks/useModals';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '@/hooks/hooks';
import { closeInvitationModal } from '@/store/app/app.slice';
import Input from '../common/Input';
import { IUser } from '@/store/auth/auth.slice';
import Image from 'next/image';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { getUsersByQuery } from '@/services/user.api';
import useAuth from '@/hooks/useAuth';
import isAuth from '@/app/ProtectedRoute';
import { GoSearch } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';
import useSocket from '@/hooks/useSocket';
import { createInvitation, createNotification } from '@/utils/utils';
import useProjects from '@/hooks/useProjects';
import { IProject } from '@/store/projects/projects.slice';
import { Sender, Subject } from '@/utils/types';
import { NewNotificationData } from '@/utils/interfaces';

const InvitationModal = () => {
    const {user} = useAuth();
    const {invitationModalOpen} = useModals();
    const {currentProject} = useProjects();
    const {socket} = useSocket();

    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const isDirty = useMemo(() => !!searchQuery, [searchQuery]);

    const memoizedResults = useMemo(() => searchResults
        .filter(res => res.userId !== user?.userId)
        .map(res => ({
            userId: res.userId,
            userName: `${res.firstName} ${res.lastName}`,
            imgSrc: res.imgSrc
        })
    ), [searchResults, user]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch();

    const handleClose = () => {
        setSearchQuery("");
        dispatch(closeInvitationModal());
    }

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const {value} = ev.target;

        setSearchQuery(value);
    }

    const handleQuery = async (query: string) => {
        return await getUsersByQuery(query);
    }

    const getUserInitials = (userName: string): string => {
        return userName.split(" ")[0].charAt(0).toUpperCase()
            + userName.split(" ")[1].charAt(0).toUpperCase();
    }

    const handleSendInvitation = (subject: Subject) => {
        // socket.emit('sendInvitation', {userId});
        const subjectAsUser = searchResults.find(u => u.userId === subject.userId) as IUser;

        if (!subjectAsUser) return;
        // Set error

        const projectData = {
            title: currentProject?.title,
            projectId: currentProject?.projectId,
        } as Pick<IProject, "projectId" | "title">;

        const notificationData: NewNotificationData = {
            data: projectData,
            type: "invitation",
            subject: {
                userId: subject?.userId,
                firstName: subject?.firstName,
                lastName: subject?.lastName
            },
            sender: {
                userId: user?.userId,
                firstName: user?.firstName,
                lastName: user?.lastName
            } as Sender,
        }

        const invitation = createNotification(notificationData);

        console.log(invitation)
        socket.emit("notification", invitation);
        // Send invitation to backend
        // Emit event from backend
        // Receive and process event in frontend

        // Notify the sender that the invitation has been sent
    }

    useEffect(() => {
        if (invitationModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [invitationModalOpen])


    useEffect(() => {
        if (isDirty) {
            handleQuery(searchQuery)
                .then(res => setSearchResults(res.data))
                .catch(e => console.error(e));
        } else setSearchResults([]);
    }, [searchQuery, isDirty])

  return (
    <Modal
        isOpen={invitationModalOpen}
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
            iconInsideInput
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
                    <div key={res.userId} className='flex gap-2 w-full items-center border p-2 bg-slate-50'>
                        <div className='flex items-center gap-2 grow'>
                            {res.imgSrc ? (
                                <Image
                                    src={res.imgSrc}
                                    alt={res.userName}
                                    width={28}
                                    height={28}
                                    className='rounded-full w-7 h-7'
                                />
                            ) : (
                                <div className='w-7 h-7 rounded-full flex items-center justify-center bg-slate-400 relative text-white'>
                                    <span className='pt-1 text-lg'>{getUserInitials(res.userName)}</span>
                                </div>
                            )}
                            <p className='text-lg'>
                                {res.userName}
                            </p>
                        </div>

                        <ButtonWithIcon
                            icon={<MdOutlinePersonAddAlt />}
                            title='Send invitation'
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