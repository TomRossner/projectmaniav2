'use client'

import React, { useCallback, useState } from 'react';
import InputContainer from '../common/InputContainer';
import Input from '../common/Input';
import { fetchUserAsync, setAuthError, setIsLoading, setUser } from '@/store/auth/auth.slice';
import { IFormProps } from './SignUpForm';
import { useAppDispatch } from '@/hooks/hooks';
import { ILoginCredentials } from '@/utils/interfaces';
import FormHeader from './FormHeader';
import GoogleLogo from '../GoogleLogo';
import { getUserFromJwt } from '@/services/localStorage';
import useAuth from '@/hooks/useAuth';
import LoadingIcon from '../LoadingIcon';

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
    <form
        autoComplete='off'
        id='loginForm'
        onSubmit={handleLoginFormSubmit}
        className={`
            ${isNotRegistered ? '-translate-x-full opacity-0 absolute' : ''}
            max-w-[500px]
            min-h-[540px]
            transition-all
            duration-200
            w-full
            grid
            grid-cols-1
            gap-5
            pb-12
            pt-5
            px-10
            border
            border-blue-500
            rounded-bl-lg
            bg-slate-100
        `}
    >

        <FormHeader text='Log into your account'/>

        <hr className='w-3/4 mx-auto'/>

        <InputContainer
            input={
            <Input
                value={loginData.email}
                type='email'
                name='email'
                id='loginEmail'
                labelText='Email'
                onChange={handleLogInInputChange}
            />
            }
        />
            

        <InputContainer
            input={
            <Input
                value={loginData.password}
                type='password'
                name='password'
                id='loginPassword'
                labelText='Password'
                onChange={handleLogInInputChange}
            />
            }
        />
            

        <p className='text-lg'>Don&apos;t have an account?
            <span onClick={toggleIsNotRegistered} className='text-blue-500 underline hover:text-blue-600 cursor-pointer px-1'>Sign up</span>
        </p>

        <button
            disabled={isLoading}
            type='submit'
            className='px-4 pb-2 pt-3 rounded-bl-lg disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60 bg-blue-400 hover:bg-blue-500 transition-all text-white font-semibold text-xl w-full mx-auto duration-75'
        >
            {isLoading
                ? (
                    
                    <>
                    <span className='flex gap-3 items-center justify-center max-w-[150px] mx-auto relative'>
                        <LoadingIcon/>
                        Loading...
                    </span>
                    </>
                )
                : 'Log in'}
        </button>

        <hr className='w-3/4 mx-auto'/>

        <button
            disabled={isLoading}
            type='button' // Set back to "submit"
            onClick={handleGoogleSignIn}
            className='
                px-4
                pb-2
                pt-3
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                disabled:opacity-60
                rounded-bl-lg
                bg-white
                hover:bg-slate-50
                transition-all
                text-blue-500
                font-semibold
                border
                border-slate-200
                text-xl
                w-full
                mx-auto
                duration-75
            '
        >
            Continue with <GoogleLogo/>
        </button>
    </form>
    </>
  )
}

export default LoginForm;