'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { fetchSession } from '@/services/auth.api';
import { setUser } from '@/store/auth/auth.slice';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const isAuth = (Component: any) => {
    return function IsAuth(props: any) {
        const {isAuthenticated} = useAuth();
        const router = useRouter();
        const dispatch = useAppDispatch();
        
        useEffect(() => {
            if (!isAuthenticated) {
                fetchSession()
                    .then(res => dispatch(setUser(res.data)))
                    .catch(err => router.push(LINKS.SIGN_IN))    
            }
        }, [])
        
        useEffect(() => {
            if (!isAuthenticated) {
                return router.push(LINKS.SIGN_IN);
            }
        }, [isAuthenticated, router])

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    }
}

export default isAuth;