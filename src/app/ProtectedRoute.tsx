'use client'

import useAuth from '@/hooks/useAuth';
import { LINKS } from '@/utils/links';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

const isAuth = (Component: any) => {
    return function IsAuth(props: any) {
        const {isAuthenticated} = useAuth();
        
        useEffect(() => {
            if (!isAuthenticated) {
                return redirect(LINKS['SIGN_IN']);
            }
        }, [])

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    }
}

export default isAuth;