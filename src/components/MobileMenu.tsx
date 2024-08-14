'use client'

import React, { useEffect, useMemo } from 'react';
import Cross from './utils/Cross';
import Logo from './utils/Logo';
import MenuList from './MenuList';
import { BiHome } from "react-icons/bi";
import { LuFolderClosed, LuInfo } from "react-icons/lu";
import { HiOutlineChatAlt } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import useMobileMenu from '@/hooks/useMobileMenu';
import useAuth from '@/hooks/useAuth';
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { twMerge } from 'tailwind-merge';
import { MenuItem } from '@/utils/types';
import { MdOutlineNotifications } from "react-icons/md";
import { IUser } from '@/store/auth/auth.slice';
import { getSocket } from '@/utils/socket';
import useNotifications from '@/hooks/useNotifications';

const MobileMenu = () => {
    const {isMobileMenuOpen, closeMobileMenu} = useMobileMenu();
    const {user, userId} = useAuth();
    const socket = getSocket();
    const {notifications} = useNotifications();

    useEffect(() => {
        if (userId) {
            socket?.emit('updateSocketId', {
                userId,
                socketId: socket.id,
            })
        }
    }, [userId])

    const ul1: MenuItem[] = useMemo(() => ([
        {
            text: "Home",
            icon: <BiHome />
        },
        {
            text: "About",
            icon: <LuInfo />
        },
        {
            text: "Projects",
            icon: <LuFolderClosed />
        },
        {
            text: "Messages",
            icon: <HiOutlineChatAlt />
        },
        {
            text: "Notifications",
            icon: <MdOutlineNotifications />,
            withCount: !!userId,
            count: notifications.length
        }
    ]), [userId, notifications])

    const ul2: MenuItem[] = useMemo(() => ([
        {
            text: "Settings",
            icon: <IoSettingsOutline />
        },
        {
            text: user
                ? `${user.firstName} ${user.lastName}`
                : "Profile",
            icon: <CgProfile />,
            imageSrc: user?.imgSrc as Pick<IUser, "imgSrc"> & string,
        },
        {
            text: "Sign in",
            icon: <CgProfile />
        },
        {
            text: "Sign out",
            icon: <TbLogout2 />
        },
    ]), [user]);

    const menuLists = [
        ul1.map(i => ({...i, action: closeMobileMenu})),
        ul2.map(i => ({...i, action: closeMobileMenu}))
    ]

  return (
    <div
        id='mobileMenuContainer'
        className={twMerge(`
            transition-transform
            duration-200
            z-50
            bg-white
            fixed
            top-0
            left-0
            w-full
            h-screen
            p-2
            ${!isMobileMenuOpen && '-translate-x-full'}
        `)}
    >
        <Cross action={closeMobileMenu} additionalStyles='absolute left-2' />
        <Logo action={closeMobileMenu} additionalStyles='absolute top-2 left-0 right-0 mx-auto z-50' />

        <div id='mobileMenu' className='flex flex-col w-full h-full fixed top-0 left-0'>
            {menuLists.map((list: MenuItem[], listIdx: number) =>
                <MenuList
                    key={listIdx}
                    list={list}
                    listIdx={listIdx}
                />
            )}
        </div>
    </div>
  )
}

export default MobileMenu;