'use client'

import useAuth from '@/hooks/useAuth';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const isAuth = (Component: any) => {
    return function IsAuth(props: any) {
        const {isAuthenticated} = useAuth();
        const router = useRouter();
        
        useEffect(() => {
            if (!isAuthenticated) {
                return router.push(LINKS.SIGN_IN);
            }
        }, [router, isAuthenticated])

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    }
}

export default isAuth;