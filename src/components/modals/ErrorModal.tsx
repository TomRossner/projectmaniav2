'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { setAuthError } from '@/store/auth/auth.slice';
import React from 'react';
import Modal from './Modal';
import useError from '@/hooks/useError';

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
    const {errorMsg, closeErrorModal, clearError} = useError();

    const closeModal = () => {
      if (authError) dispatch(setAuthError(null));

      if (errorMsg) clearError();

      closeErrorModal();
      
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
      isOpen={(authError || errorMsg)
        ? true
        : false
      }
    >
      <p className='text-stone-500 w-full text-lg min-h-14'>
        {authError || errorMsg}.
      </p>
    </Modal>
  )
}

export default ErrorModal;