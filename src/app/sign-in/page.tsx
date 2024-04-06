'use client'

import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SignUpForm from '@/components/forms/SignUpForm';
import LoginForm from '@/components/forms/LoginForm';
import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { setIsAuthenticated } from '@/store/auth/auth.slice';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';

const SignIn = () => {
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>(false);

  const toggleIsNotRegistered = (): void => setIsNotRegistered(!isNotRegistered);

  const dispatch = useAppDispatch();
  const {user, isAuthenticated} = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user) dispatch(setIsAuthenticated(true));
    if (!user && isAuthenticated) dispatch(setIsAuthenticated(false));

    if (isAuthenticated) router.push(LINKS['HOME']);
  }, [user, isAuthenticated])

  return (
    <div id='signInPage' className='my-auto w-full p-10 flex flex-col gap-10'>
      <PageHeader text='Sign in'/>
      
      <div className='flex items-center justify-center w-full overflow-x-hidden'>
        <SignUpForm
          isNotRegistered={isNotRegistered}
          setIsNotRegistered={setIsNotRegistered}
          toggleIsNotRegistered={toggleIsNotRegistered}
        />
        
        <LoginForm
          isNotRegistered={isNotRegistered}
          setIsNotRegistered={setIsNotRegistered}
          toggleIsNotRegistered={toggleIsNotRegistered}
        />
      </div>
    </div>
  )
}

export default SignIn;