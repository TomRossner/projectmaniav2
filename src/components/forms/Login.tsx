'use client'

import React from 'react';
import { useForm } from "react-hook-form";
import FormHeader from './FormHeader';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/utils/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleLogo from '../utils/GoogleLogo';
import { fetchUserAsync, setAuthError } from '@/store/auth/auth.slice';
import { useAppDispatch } from '@/hooks/hooks';
import LoadingIcon from '../utils/LoadingIcon';
import Button from '../common/Button';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import Line from '../common/Line';
import { BsGithub } from 'react-icons/bs';

const logInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`),
});

type TLogInSchema = z.infer<typeof logInSchema>;

type LoginProps = {
    toggleIsNotRegistered: () => void;
}

const Login = ({toggleIsNotRegistered}: LoginProps) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TLogInSchema>({
        resolver: zodResolver(logInSchema)
    });

    const dispatch = useAppDispatch();
    const router = useRouter();

    const onSubmit = async (data: TLogInSchema) => {
        try {
            const {email, password} = data;
            const user = await dispatch(fetchUserAsync({
                email,
                password
            }))
                .unwrap()
                .catch(
                    (error: {message: string}) => {
                        console.log(error);
                        dispatch(setAuthError(error.message));
                    }
                );

            if (user) {
                reset();
                router.push(LINKS.HOME);
            }
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div className='w-full flex flex-col bg-slate-100 pt-5 pb-12 border rounded-bl-lg px-10 gap-5 max-w-[500px] min-h-[450px] border-slate-200'>
        <form
            id='signIn'
            onSubmit={handleSubmit(onSubmit)}
            className={twMerge(`
                transition-all
                duration-100
                w-full
                grid
                grid-cols-1
                gap-5
            `)}
        >
            <FormHeader text='Login' />

            <Line additionalStyles='w-3/4 mx-auto' />

            <div className='grid grid-cols-2 w-full gap-2'>
                <input
                    {...register("email")}
                    type="email"
                    placeholder='Email'
                    autoComplete='username'
                    className='col-span-2 px-2 pt-1 outline-none border border-transparent focus:border-blue-500 rounded-bl-lg mb-2 last:mb-0'
                />

                <input
                    {...register("password")}
                    type="password"
                    placeholder='Password'
                    autoComplete='current-password'
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


        </form>

        <Line additionalStyles='w-3/4 mx-auto'/>
        
        <form action="http://localhost:3001/api/auth/login/google" method="get">
            <Button
                disabled={isSubmitting}
                type='submit'
                // action={handleGoogleSignIn}
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
        <form action="http://localhost:3001/api/auth/login/github" method="get">
            <Button
                disabled={isSubmitting}
                type='submit'
                // action={handleGoogleSignIn}
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
                    text-stone-700
                    text-xl
                    sm:hover:text-stone-800
                    active:text-stone-800
                `}
            >
                <BsGithub />
                <span className='pt-1'>Continue with GitHub</span>
            </Button>
        </form>
    </div>
  )
}

export default Login;