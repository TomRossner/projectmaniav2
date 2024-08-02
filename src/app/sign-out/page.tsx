'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { deleteSession } from '@/services/auth.api';
import { deleteJwt } from '@/services/localStorage';
import { logout, setUser } from '@/store/auth/auth.slice';
import { LINKS } from '@/utils/links';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignOut = () => {
    const dispatch = useAppDispatch();

    const {user} = useAuth();

    const router = useRouter();

    useEffect(() => {
        dispatch(setUser(null));
    }, [])

    useEffect(() => {
        if (!user) {
          // deleteJwt();
          deleteSession().then(res => console.log(res));

          dispatch(logout());
          
          router.push(LINKS.SIGN_IN);
        }
    }, [user])

  return null;
}

export default SignOut;