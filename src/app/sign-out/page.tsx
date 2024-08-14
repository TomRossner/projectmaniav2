'use client'

import BackLayer from '@/components/common/BackLayer';
import LoadingModal from '@/components/modals/LoadingModal';
import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { logoutUser, setUser } from '@/store/auth/auth.slice';
import { LINKS } from '@/utils/links';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignOut = () => {
    const dispatch = useAppDispatch();

    const {user, isLoading} = useAuth();

    const router = useRouter();

    useEffect(() => {
        dispatch(setUser(null));
    }, [dispatch])

    useEffect(() => {
        if (!user) {
          dispatch(logoutUser());
        }
    }, [user, dispatch, router])

    useEffect(() => {
      if (!isLoading) {
        router.push(LINKS.SIGN_IN);
      }
    }, [isLoading, router])

  return (
    <BackLayer>
      <LoadingModal isOpen={isLoading} text='Logging out...' />
    </BackLayer>
  )
}

export default SignOut;