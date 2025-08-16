'use client'

import Container from '@/components/common/Container';
import Login from '@/components/forms/Login';
import HomePage from '@/components/home/HomePage';
import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { fetchSession } from '@/services/auth.api';
import { IUser, setUser } from '@/store/auth/auth.slice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
    const dispatch = useAppDispatch();
    const {isAuthenticated, user, userId, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchSession()
            .then(res => dispatch(setUser(res.data)))
            .catch(err => <Login />)
    }, [])

    if (!isLoading && !isAuthenticated) {
        return router.push('/login');
    }
    
    return (
        <HomePage
            user={user as IUser}
            userId={userId as string}
        />
    )
}

export default Page;