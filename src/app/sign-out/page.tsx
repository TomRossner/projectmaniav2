'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { deleteJwt } from '@/services/localStorage';
import { logout, setUser } from '@/store/auth/auth.slice';
import { LINKS } from '@/utils/links';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const SignOut = () => {
    const dispatch = useAppDispatch();

    const {user} = useAuth();

    useEffect(() => {
        dispatch(setUser(null));
    }, [])

    useEffect(() => {
        if (!user) {
          deleteJwt();

          dispatch(logout());
          
          redirect(LINKS['SIGN_IN']);
        }
    }, [user])

  return null;
}

export default SignOut;