'use client'

import React, { ReactNode } from 'react';
import Cross from './utils/Cross';
import { useAppDispatch } from '@/hooks/hooks';
import { closeMobileMenu } from '@/store/app/app.slice';
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
import { IUser } from '@/store/auth/auth.slice';
import { twMerge } from 'tailwind-merge';

export interface IMenuItem {
    text: string;
    action: () => void;
    icon?: ReactNode;
    imageSrc?: Partial<IUser> & string;
}

const MobileMenu = () => {
    const {mobileMenu} = useMobileMenu();
    const {user} = useAuth();

    const dispatch = useAppDispatch();

    const closeMenu = () => dispatch(closeMobileMenu());


    const ul1: IMenuItem[] = [
        {
            text: "Home",
            action: () => {
                closeMenu();
            },
            icon: <BiHome />
        },
        {
            text: "About",
            action: () => {
                closeMenu();
            },
            icon: <LuInfo />
        },
        {
            text: "Projects",
            action: () => {
                closeMenu();
            },
            icon: <LuFolderClosed />
        },
        {
            text: "Messages",
            action: () => {
                closeMenu();
            },
            icon: <HiOutlineChatAlt />
        },
    ]

    const ul2: IMenuItem[] = [
        {
            text: "Settings",
            action: () => {
                closeMenu();
            },
            icon: <IoSettingsOutline />
        },
        {
            text: user
                ? `${user.firstName} ${user.lastName}`
                : "Profile",
            action: () => {
                closeMenu();
            },
            icon: <CgProfile />,
            imageSrc: user?.imgSrc
        },
        {
            text: "Sign in",
            action: () => {
                closeMenu();
            },
            icon: <CgProfile />
        },
        {
            text: "Sign out",
            action: () => {
                closeMenu();
            },
            icon: <TbLogout2 />
        },
    ]

    const menuLists = [
        ul1,
        ul2
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
            ${!mobileMenu && '-translate-x-full'}
        `)}
    >
        <Cross action={closeMenu} additionalStyles='absolute left-2'/>
        <Logo action={closeMenu} additionalStyles='absolute top-2 left-0 right-0 mx-auto z-50'/>

        <div id='mobileMenu' className='flex flex-col w-full h-full fixed top-0 left-0'>
            {menuLists.map((list: IMenuItem[], listIdx: number) =>
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