'use client'

import React, { useCallback, useState } from 'react';
import InputContainer from '../common/InputContainer';
import Input from '../common/Input';
import { fetchUserAsync, setAuthError, setIsLoading, setUser } from '@/store/auth/auth.slice';
import { IFormProps } from './SignUpForm';
import { useAppDispatch } from '@/hooks/hooks';
import { ILoginCredentials } from '@/utils/interfaces';
import FormHeader from './FormHeader';
import GoogleLogo from '../utils/GoogleLogo';
import { getUserFromJwt } from '@/services/localStorage';
import useAuth from '@/hooks/useAuth';
import LoadingIcon from '../utils/LoadingIcon';
import { twMerge } from 'tailwind-merge';
import Login from "./Login";

export const INITIAL_LOGIN_DATA: ILoginCredentials = {
    email: '',
    password: ''
}

const LoginForm = ({toggleIsNotRegistered, isNotRegistered}: IFormProps) => {
    const [loginData, setLoginData] = useState<ILoginCredentials>(INITIAL_LOGIN_DATA);

    const dispatch = useAppDispatch();

    const {isLoading} = useAuth();

    const handleLoginFormSubmit = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
        ev.preventDefault();

        const {
            email,
            password
        } = loginData;

        const userCredentials: ILoginCredentials = {
            email: email.trim(),
            password: password.trim()
        }

        await dispatch(fetchUserAsync(userCredentials))
            .unwrap()
            .catch(
                ({message}: {message: string}) =>
                    dispatch(setAuthError(message ? message : 'Failed logging in'))
            );

        dispatch(setIsLoading(false));

        dispatch(setUser(getUserFromJwt()));

        setLoginData(INITIAL_LOGIN_DATA);
    }

    const handleLogInInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {

        setLoginData({...loginData, [ev.target.name]: ev.target.value});
    }, [loginData]);

    const handleGoogleSignIn = async () => {
        // const response = await googleSignIn(loginData.email)
        await dispatch(fetchUserAsync({
            email: process.env.NEXT_PUBLIC_MOCK_EMAIL as string,
            password: process.env.NEXT_PUBLIC_MOCK_PASSWORD as string
        }))
            .unwrap()
            .catch(
                ({message}: {message: string}) =>
                    dispatch(setAuthError(message ? message : 'Failed logging in'))
            );

        dispatch(setIsLoading(false));

        dispatch(setUser(getUserFromJwt()));

        setLoginData(INITIAL_LOGIN_DATA);

    }

  return (
    <>
    {!isNotRegistered && <Login toggleIsNotRegistered={toggleIsNotRegistered} />}
    </>
  )
}

export default LoginForm;