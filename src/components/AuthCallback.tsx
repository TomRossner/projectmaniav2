// In your React component for /auth/callback
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSession } from '@/services/auth.api';
import Container from './common/Container';
import { useAppDispatch } from '@/hooks/hooks';
import { setUser } from '@/store/auth/auth.slice';
import Loading from './common/Loading';

const AuthCallback = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetchSession();

        if (res.status === 200) {
            dispatch(setUser(res.data));
            router.push('/');
        } else {
            setTimeout(checkSession, 1000); // Retry after 1 second
        }
      } catch (error) {
        console.error('Failed to check session', error);
      }
    };

    checkSession();
  }, [router]);

  return (
    <Container id='authCallback'>
      <Loading text='Logging in...' withText />
    </Container>
  ) 
}

export default AuthCallback;