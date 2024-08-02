'use client'

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { setIsAuthenticated } from '@/store/auth/auth.slice';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import Container from '@/components/common/Container';
import Login from '@/components/forms/Login';
import SignUp from '@/components/forms/SignUp';

const SignIn = () => {
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>(false);

  const toggleIsNotRegistered = (): void => setIsNotRegistered(!isNotRegistered);

  const dispatch = useAppDispatch();
  const {user, isAuthenticated} = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user && isAuthenticated) dispatch(setIsAuthenticated(false));

    if (isAuthenticated) router.push(LINKS['HOME']);
  }, [user, isAuthenticated])

  return (
    <Container id='signInPage' className='my-auto w-full flex flex-col gap-5'>
      <Header text='Sign in'/>
      
      <div className='flex items-center justify-center w-full overflow-x-hidden'>
        {isNotRegistered
          ? <SignUp
              toggleIsNotRegistered={toggleIsNotRegistered}
            />
          :
            <Login
              toggleIsNotRegistered={toggleIsNotRegistered}
            />
        }
      </div>
    </Container>
  )
}

export default SignIn;