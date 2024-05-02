'use client'

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import SignUpForm from '@/components/forms/SignUpForm';
import LoginForm from '@/components/forms/LoginForm';
import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { setIsAuthenticated } from '@/store/auth/auth.slice';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import Container from '@/components/common/Container';

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
    <Container id='signInPage' className='my-auto w-full flex flex-col gap-5'>
      <Header text='Sign in'/>
      
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
    </Container>
  )
}

export default SignIn;