'use client'

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from '@/store/auth/auth.selectors';
import { IUser } from '@/store/auth/auth.slice';
import { TeamMember } from '@/store/projects/projects.slice';

const useAuth = () => {
    const {
      isAuthenticated,
      user,
      isLoading,
      authError
    } = useAppSelector(selectAuth);

    const dispatch = useAppDispatch();

    const getUserName = (user: IUser | TeamMember): string => {
      return `${user.firstName} ${user.lastName}`;
    }
    
    const getUserInitials = (userName: string): string => {
      return userName.split(" ")[0].charAt(0).toUpperCase()
          + userName.split(" ")[1].charAt(0).toUpperCase();
    }

    const userInitials = (user: IUser | TeamMember): string => {
      const {firstName, lastName} = user;
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    }

    const userId = useMemo(() => user?.userId, [user]);

    return {
      user,
      isAuthenticated,
      isLoading,
      authError,
      userId,
      getUserInitials,
      getUserName,
      userInitials,
    }
}

export default useAuth;