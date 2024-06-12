'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { closeErrorModal, setError } from '@/store/app/app.slice';
import { setAuthError } from '@/store/auth/auth.slice';
import React from 'react';
import { selectError } from '@/store/app/app.selectors';
import Modal from './Modal';

type ErrorModalProps = {
  action?: () => void;
  withSubmitBtn?: boolean;
  onSubmit?: () => void;
  submitBtnText?: string;
}

const ErrorModal = ({
  action,
  onSubmit,
  withSubmitBtn = false,
  submitBtnText,
}: ErrorModalProps) => {
    const dispatch = useAppDispatch();

    const {authError} = useAuth();
    const error = useAppSelector(selectError);

    const closeModal = () => {
        dispatch(authError ? setAuthError(null) : setError(null));
        dispatch(closeErrorModal());
        if (action) action();
    }

  return (
    <Modal
      title='Error'
      onClose={closeModal}
      closeBtnText='Close'
      withSubmitBtn={withSubmitBtn}
      submitBtnText={submitBtnText}
      onSubmit={onSubmit}
      isOpen={(authError || error)
        ? true
        : false
      }
    >
      <p className='text-stone-500 w-full text-lg min-h-14'>
        {authError || error}.
      </p>
    </Modal>
  )
}

export default ErrorModal;