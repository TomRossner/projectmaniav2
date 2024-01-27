'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { closeErrorModal, setError } from '@/store/app/app.slice';
import { setAuthError } from '@/store/auth/auth.slice';
import React from 'react';
import Button from '../common/Button';
import ModalTitle from './ModalTitle';
import { selectError } from '@/store/app/app.selectors';

const ErrorModal = () => {
    const dispatch = useAppDispatch();

    const {authError} = useAuth();
    const error = useAppSelector(selectError);

    const closeModal = () => {
        dispatch(closeErrorModal());
        dispatch(authError ? setAuthError(null) : setError(null));
    }

  return (
    <>
    {(authError || error) && <div id='modalBackdrop' className='w-screen h-screen absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center z-50'>
        <div id='errorModal' className='min-w-[300px] max-w-[400px] min-h-24 m-auto border border-stone-500 bg-slate-100 py-3 px-4 rounded-bl-lg flex flex-col gap-1 drop-shadow-md'>
            <ModalTitle text='Error'/>
            
            <hr className='w-full'/>
            
            <p className='text-stone-500 w-full text-lg min-h-14'>{authError || error}.</p>
            
            <hr className='w-full pb-1'/>
            
            <Button action={closeModal} text='Close' additionalStyles='rounded-bl-lg hover:bg-slate-200'/>
        </div>
    </div>}
    </>
  )
}

export default ErrorModal;