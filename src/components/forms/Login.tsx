'use client'

import React from 'react';
import { useForm } from "react-hook-form";
import FormHeader from './FormHeader';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/utils/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleLogo from '../utils/GoogleLogo';
import { fetchUserAsync, setAuthError, setUser } from '@/store/auth/auth.slice';
import { useAppDispatch } from '@/hooks/hooks';
import { getUserFromJwt } from '@/services/localStorage';
import LoadingIcon from '../utils/LoadingIcon';
import Button from '../common/Button';

const logInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`),
});

type TLogInSchema = z.infer<typeof logInSchema>;

const SignUp = ({toggleIsNotRegistered}: {toggleIsNotRegistered: () => void}) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TLogInSchema>({
        resolver: zodResolver(logInSchema)
    });

    const dispatch = useAppDispatch();

    const onSubmit = async (data: TLogInSchema) => {
        try {
            const {email, password} = data;
            await dispatch(fetchUserAsync({
                email,
                password
            }))
                .unwrap()
                .catch(
                    ({message}: {message: string}) =>
                        dispatch(setAuthError(message && 'Failed logging in'))
                );
    
            dispatch(setUser(getUserFromJwt()));
    
            reset();
        } catch (error) {
            console.error(error);
        }
    }

    const handleGoogleSignIn = async () => {
        // const response = await googleSignIn(loginData.email)
        await dispatch(fetchUserAsync({
            email: process.env.NEXT_PUBLIC_MOCK_EMAIL as string,
            password: process.env.NEXT_PUBLIC_MOCK_PASSWORD as string
        }))
            .unwrap()
            .catch(
                ({message}: {message: string}) =>
                    dispatch(setAuthError(message && 'Failed logging in'))
            );

        dispatch(setUser(getUserFromJwt()));

        reset();
    }

  return (
    <form
        id='signIn'
        onSubmit={handleSubmit(onSubmit)}
        className={twMerge(`
            max-w-[500px]
            min-h-[450px]
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
            border-slate-200
            rounded-bl-lg
            bg-slate-100
        `)}
    >
        <FormHeader text='Login' />

        <hr className='w-3/4 mx-auto' />

        <div className='grid grid-cols-2 w-full gap-2'>
            <input
                {...register("email")}
                type="email"
                placeholder='Email'
                className='col-span-2 px-2 pt-1 outline-none border border-transparent focus:border-blue-500 rounded-bl-lg mb-2 last:mb-0'
            />

            <input
                {...register("password")}
                type="password"
                placeholder='Password'
                className='col-span-2 px-2 pt-1 outline-none border border-transparent focus:border-blue-500 rounded-bl-lg mb-2 last:mb-0'
            />
        </div>

        <p className='text-lg'>Don&apos;t have an account?
            <span
                onClick={toggleIsNotRegistered}
                className='text-blue-500 underline hover:text-blue-600 cursor-pointer px-1'
            >
                Sign up
            </span>
        </p>

        <button
            disabled={isSubmitting}
            type='submit'
            className={`
                px-4
                pb-2
                pt-3
                rounded-bl-lg
                disabled:bg-blue-300
                disabled:cursor-not-allowed
                disabled:opacity-60
                bg-blue-400
                hover:bg-blue-500
                transition-all
                text-white
                font-semibold
                text-xl
                w-full
                mx-auto
                duration-75
                max-h-[55px]
            `}
        >
            {isSubmitting
                ? (
                    <span className='flex gap-3 items-center justify-center max-w-[150px] mx-auto relative'>
                        <LoadingIcon />
                        Loading...
                    </span>
                )
                : 'Log in'
            }
        </button>

        <hr className='w-3/4 mx-auto'/>

        <Button
            disabled={isSubmitting}
            type='button' // Set back to "submit"
            action={handleGoogleSignIn}
            additionalStyles={`
                flex
                w-full
                border
                border-slate-200
                items-center
                justify-center
                gap-2
                bg-slate-50
                sm:hover:bg-white
                active:bg-white
                rounded-bl-lg
                text-blue-400
                text-xl
                sm:hover:text-blue-500
                active:text-blue-500
            `}
        >
            <GoogleLogo width='w-5' />
            <span className='pt-1'>Continue with Google</span>
        </Button>
    </form>
  )
}

export default SignUp;