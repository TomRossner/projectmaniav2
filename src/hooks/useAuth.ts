'use client'

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from '@/store/auth/auth.selectors';
import { setUser } from '@/store/auth/auth.slice';
import { getUserFromJwt, setTokenHeader } from '@/services/localStorage';

const useAuth = () => {
    const {
      isAuthenticated,
      user,
      isLoading,
      authError
    } = useAppSelector(selectAuth);

    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(setUser(getUserFromJwt()));
      setTokenHeader();
    }, [])

    return {
      user,
      isAuthenticated,
      isLoading,
      authError,
    }
}

export default useAuth;