'use client'

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import Container from '@/components/common/Container';
import Login from '@/components/forms/Login';
import SignUp from '@/components/forms/SignUp';

const LoginPage = () => {
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>(false);

  const toggleIsNotRegistered = () => setIsNotRegistered(!isNotRegistered);

  const {user, isAuthenticated} = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push(LINKS.HOME);
  }, [user, isAuthenticated, router])

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

export default LoginPage;