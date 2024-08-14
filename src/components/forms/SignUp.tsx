'use client'

import React from 'react';
import { useForm } from "react-hook-form";
import FormHeader from './FormHeader';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/utils/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@/services/auth.api';
import Line from '../common/Line';
import { useAppDispatch } from '@/hooks/hooks';
import { setErrorMsg } from '@/store/error/error.slice';

const signUpSchema = z.object({
    firstName: z
        .string()
        .min(NAME_MIN_LENGTH, `Name too short. Must be at least ${NAME_MIN_LENGTH} characters`)
        .max(NAME_MAX_LENGTH, `Name too long`)
        .regex(/[a-zA-Z]/),
    lastName: z
        .string()
        .min(NAME_MIN_LENGTH, `Name too short. Must be at least ${NAME_MIN_LENGTH} characters`)
        .max(NAME_MAX_LENGTH, 'Name too long')
        .regex(/[a-zA-Z]/),
    email: z.string().email(),
    password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`)
        .max(PASSWORD_MAX_LENGTH, 'Password too long'),
    confirmedPassword: z
        .string()
        .min(PASSWORD_MIN_LENGTH, `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`)
        .max(PASSWORD_MAX_LENGTH, 'Password too long'),
}).refine(data => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

type SignUpProps = {
    toggleIsNotRegistered: () => void;
}

const SignUp = ({toggleIsNotRegistered}: SignUpProps) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema)
    });

    const dispatch = useAppDispatch();

    const onSubmit = async (data: TSignUpSchema) => {
        try {
            await signUp(data);
            
            reset();
            toggleIsNotRegistered();
        } catch (error: any) {
            console.error(error);

            if (error.response.status === 409) {
                dispatch(setErrorMsg(error.response.data.error));
                toggleIsNotRegistered();
            }

            reset();
        }
    }

  return (
    <form
        id='signUp'
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
        <FormHeader text='Create an account' />

        <Line additionalStyles='w-3/4 mx-auto' />

        <div className='grid grid-cols-2 w-full gap-2'>
            <input
                {...register("firstName", {
                    pattern: /[a-zA-Z]/,
                    minLength: NAME_MIN_LENGTH,
                    maxLength: NAME_MAX_LENGTH,
                    required: true,
                })}
                type="text"
                placeholder='First name'
                className={twMerge(`
                    px-2
                    pt-1
                    outline-none
                    border
                    focus:border-blue-500
                    rounded-bl-lg
                    mb-2
                    last:mb-0
                    ${errors.firstName
                        ? 'border-red-400'
                        : 'border-transparent'
                    }
                `)}
            />

            <input
                {...register("lastName", {
                    pattern: /[a-zA-Z]/,
                    minLength: NAME_MIN_LENGTH,
                    maxLength: NAME_MAX_LENGTH,
                    required: true,
                })}
                type="text"
                placeholder='Last name'
                className={twMerge(`
                    px-2
                    pt-1
                    outline-none
                    border
                    focus:border-blue-500
                    rounded-bl-lg
                    mb-2
                    last:mb-0
                    ${errors.firstName
                        ? 'border-red-400'
                        : 'border-transparent'
                    }
                `)}
            />
            
            {(errors.firstName || errors.lastName) && (
                <div className='w-full flex grow gap-1 items-center flex-col col-span-2'>
                    <p className='px-2 py-0.5 bg-red-400 w-full text-white rounded-bl-lg'>{errors.firstName?.message || errors.lastName?.message}</p>
                    {/* {errors.lastName && <p className='px-2 py-0.5 bg-red-400 w-full text-white rounded-bl-lg'>{errors.lastName?.message}</p>} */}
                </div>
            )}

            <input
                {...register("email", {
                    required: true,
                })}
                type="email"
                placeholder='Email'
                className={twMerge(`
                    col-span-2 
                    px-2 
                    pt-1 
                    outline-none 
                    border 
                    focus:border-blue-500 
                    rounded-bl-lg 
                    mb-2 
                    last:mb-0 
                    ${errors.firstName
                        ? 'border-red-400'
                        : 'border-transparent'
                    }
                `)}
            />
            {errors.email && (
                <div className='w-full flex grow gap-1 items-center flex-col col-span-2'>
                    {errors.email && <p className='px-2 py-0.5 bg-red-400 w-full text-white rounded-bl-lg'>{errors.email?.message}</p>}
                </div>
            )}

            <input
                {...register("password", {
                    minLength: PASSWORD_MIN_LENGTH,
                    maxLength: PASSWORD_MAX_LENGTH,
                    required: true,
                })}
                type="password"
                placeholder='Password'
                className={twMerge(`
                    col-span-2
                    px-2
                    pt-1
                    outline-none
                    border
                    focus:border-blue-500
                    rounded-bl-lg
                    mb-2
                    last:mb-0
                    ${errors.firstName
                        ? 'border-red-400'
                        : 'border-transparent'
                    }
                `)}
            />
            {errors.password && (
                <div className='w-full flex grow gap-1 items-center flex-col col-span-2'>
                    {errors.password && <p className='px-2 py-0.5 bg-red-400 w-full text-white rounded-bl-lg'>{errors.password?.message}</p>}
                </div>
            )}
            <input
                {...register("confirmedPassword", {
                    minLength: PASSWORD_MIN_LENGTH,
                    maxLength: PASSWORD_MAX_LENGTH,
                    required: true,
                })}
                type="password"
                placeholder='Confirm password'
                className={twMerge(`
                    col-span-2 
                    px-2 
                    pt-1 
                    outline-none 
                    border 
                    focus:border-blue-500 
                    rounded-bl-lg 
                    ${errors.firstName
                        ? 'border-red-400'
                        : 'border-transparent'
                    }
                `)}
            />
            {errors.confirmedPassword && (
                <div className='w-full flex grow gap-1 items-center flex-col col-span-2'>
                    {errors.confirmedPassword && <p className='px-2 py-0.5 bg-red-400 w-full text-white rounded-bl-lg'>{errors.confirmedPassword?.message}</p>}
                </div>
            )}
        </div>

        <p className='text-lg'>Already have an account?
            <span
                onClick={toggleIsNotRegistered}
                className='text-blue-500 underline hover:text-blue-600 cursor-pointer px-1'
            >
                Log in
            </span>
        </p>

        <button
            type='submit'
            disabled={isSubmitting}
            className={twMerge(`
                px-4
                pb-2
                pt-3
                rounded-bl-lg
                bg-blue-400
                hover:bg-blue-500
                transition-all
                text-white
                font-semibold
                text-2xl
                w-full
                mx-auto
                duration-75
                max-h-[55px]
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                disabled:opacity-60
            `)}
        >
            {isSubmitting ? 'Loading...' : 'Submit'}
        </button>
    </form>
  )
}

export default SignUp;