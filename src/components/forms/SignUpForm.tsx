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
import { isValidPasswordPattern } from '@/utils/forms';

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

    const handleSignUpFormSubmit = async (ev: React.FormEvent<HTMLFormElement>): Promise<void> => {
        ev.preventDefault();
  
        if (formError) setFormError(null);
  
        const {
          email,
          firstName,
          lastName,
          password,
          confirmPassword
        } = signUpData;
  
        if (password !== confirmPassword) {
            dispatch(setAuthError('Passwords do not match'));
            return;
        } else if (!isValidPasswordPattern(password)) {
            dispatch(setAuthError(`Invalid password`));
            // Make sure your password contains at least ${PASSWORD_REGEX.MIN_LENGTH} characters, 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special characters.
            return;
        }
  
        
        const userData: IUserSignUpData = {
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            // email: email.trim(),
            // password: password.trim()
            email: process.env.NEXT_PUBLIC_MOCK_EMAIL_2 as string,
            password: process.env.NEXT_PUBLIC_MOCK_PASSWORD_2 as string
        }
        
        try {
            await signUp(userData);

            setIsNotRegistered(false);
            setSignUpData({...INITIAL_SIGN_UP_DATA});
        } catch (error: any) {
            if (error.response) {
                const {
                    response: {
                        data: {
                            error: signUpError
                        }
                    }
                } = error;

                dispatch(setAuthError(signUpError));
            } else {
                console.error(error);
                dispatch(setAuthError('Failed registering new user'));
            }
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const handleSignUpInputChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (formError) setFormError(null);
    
          setSignUpData({...signUpData, [ev.target.name]: ev.target.value});
    }, [signUpData, formError]);

  return (
    <>
    <form
        autoComplete='off'
        id='signUpForm'
        onSubmit={handleSignUpFormSubmit}
        className={`
            ${!isNotRegistered ? 'translate-x-full opacity-0 absolute' : ''}
            max-w-[500px]
            min-h-[540px]
            transition-all
            duration-100
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

        <FormHeader text='Create an account'/>

        <hr className='w-full mx-auto'/>

        <div className='grid grid-cols-2 w-full gap-2'>
            <InputContainer 
                input={
                <Input
                    value={signUpData.firstName}
                    type='text'
                    name='firstName'
                    id='firstName'
                    labelText='First name'
                    onChange={handleSignUpInputChange}
                />
                }
            />

            <InputContainer 
                input={
                <Input
                    value={signUpData.lastName}
                    type='text'
                    name='lastName'
                    id='lastName'
                    labelText='Last name'
                    onChange={handleSignUpInputChange}
                />
                }
            />
            
            <InputContainer
                input={
                <Input
                    value={signUpData.email}
                    type='email'
                    name='email'
                    id='signUpEmail'
                    labelText='Email'
                    onChange={handleSignUpInputChange}
                />
                }
                additionalStyles='col-span-2'
            />
            
            <InputContainer 
                input={
                <Input
                    value={signUpData.password}
                    type='password'
                    name='password'
                    id='signUpPassword'
                    labelText='Password'
                    onChange={handleSignUpInputChange}
                />
                }
            />

            <InputContainer 
                input={
                <Input
                    value={signUpData.confirmPassword}
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    labelText='Confirm password'
                    onChange={handleSignUpInputChange}
                />
                }
            />
        </div>

        <p className='text-lg'>Already have an account?
            <span onClick={toggleIsNotRegistered} className='text-blue-500 underline hover:text-blue-600 cursor-pointer px-1'>Log in</span>
        </p>

        <button
            type='submit'
            className='px-4 pb-2 pt-3 rounded-bl-lg bg-blue-400 hover:bg-blue-500 transition-all text-white font-semibold text-2xl w-full mx-auto duration-75'
        >
            Submit
        </button>
    </form>
    </>
  )
}

export default SignUpForm;