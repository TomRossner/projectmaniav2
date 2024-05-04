'use client'

import { useAppDispatch } from '@/hooks/hooks';
import { signUp } from '@/services/auth.api';
import { setAuthError, setIsLoading } from '@/store/auth/auth.slice';
import { IUserSignUpData } from '@/utils/interfaces';
import { capitalizeFirstLetter } from '@/utils/utils';
import React, { useCallback, useState } from 'react';
import InputContainer from '../common/InputContainer';
import Input from '../common/Input';
import FormHeader from './FormHeader';
import { INITIAL_LOGIN_DATA } from './LoginForm';
// import { isValidPasswordPattern } from '@/utils/forms';
import { twMerge } from 'tailwind-merge';
import SignUp from './SignUp';

const INITIAL_SIGN_UP_DATA: IUserSignUpData = {
    ...INITIAL_LOGIN_DATA,
    firstName: '',
    lastName: '',
    confirmPassword: ''
}

export interface IFormProps {
    isNotRegistered?: boolean;
    setIsNotRegistered: (bool: boolean) => void;
    toggleIsNotRegistered: () => void;
}

const SignUpForm = ({setIsNotRegistered, toggleIsNotRegistered, isNotRegistered}: IFormProps) => {
    const [signUpData, setSignUpData] = useState<IUserSignUpData>(INITIAL_SIGN_UP_DATA);
    
    const [formError, setFormError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    // const handleSignUpFormSubmit = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
    //     ev.preventDefault();
  
    //     if (formError) setFormError(null);
  
    //     const {
    //       email,
    //       firstName,
    //       lastName,
    //       password,
    //       confirmPassword
    //     } = signUpData;
  
    //     if (password !== confirmPassword) {
    //         dispatch(setAuthError('Passwords do not match'));
    //         return;
    //     } else if (!isValidPasswordPattern(password)) {
    //         dispatch(setAuthError(`Invalid password`));
    //         // Make sure your password contains at least ${PASSWORD_REGEX.MIN_LENGTH} characters, 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special characters.
    //         return;
    //     }
  
        
    //     const userData: IUserSignUpData = {
    //         firstName: capitalizeFirstLetter(firstName),
    //         lastName: capitalizeFirstLetter(lastName),
    //         // email: email.trim(),
    //         // password: password.trim()
    //         email: process.env.NEXT_PUBLIC_MOCK_EMAIL_2 as string,
    //         password: process.env.NEXT_PUBLIC_MOCK_PASSWORD_2 as string
    //     }
        
    //     try {
    //         await signUp(userData);

    //         setIsNotRegistered(false);
    //         setSignUpData({...INITIAL_SIGN_UP_DATA});
    //     } catch (error: any) {
    //         if (error.response) {
    //             const {
    //                 response: {
    //                     data: {
    //                         error: signUpError
    //                     }
    //                 }
    //             } = error;

    //             dispatch(setAuthError(signUpError));
    //         } else {
    //             console.error(error);
    //             dispatch(setAuthError('Failed registering new user'));
    //         }
    //     } finally {
    //         dispatch(setIsLoading(false));
    //     }
    // }

    const handleSignUpInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (formError) setFormError(null);
    
          setSignUpData({...signUpData, [ev.target.name]: ev.target.value});
    }, [signUpData, formError]);

  return (
    <>
    {isNotRegistered && <SignUp toggleIsNotRegistered={toggleIsNotRegistered} />}
    </>
  )
}

export default SignUpForm;