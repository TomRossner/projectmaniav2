'use client'

import React from 'react';
import { useForm } from "react-hook-form";
import FormHeader from './FormHeader';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '@/utils/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@/services/auth.api';

const signUpSchema = z.object({
    firstName: z.string().min(NAME_MIN_LENGTH, `Names must be at least ${NAME_MIN_LENGTH} characters`),
    lastName: z.string().min(NAME_MIN_LENGTH, `Names must be at least ${NAME_MIN_LENGTH} characters`),
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

const SignUp = ({toggleIsNotRegistered}: {toggleIsNotRegistered: () => void}) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit = async (data: TSignUpSchema) => {
        try {
            await signUp(data);
            reset();
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <>
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
            <FormHeader text='Create an account'/>

            <hr className='w-3/4 mx-auto'/>

            <div className='grid grid-cols-2 w-full gap-2'>
                <input
                    {...register("firstName")}
                    type="text"
                    placeholder='First name'
                    className='px-2 pt-1 outline-none border border-transparent focus:border-blue-500 rounded-bl-lg mb-2 last:mb-0'
                />
                <input
                    {...register("lastName")}
                    type="text"
                    placeholder='Last name'
                    className='px-2 pt-1 outline-none border border-transparent focus:border-blue-500 mb-2 last:mb-0'
                />

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
                <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder='Confirm password'
                    className='col-span-2 px-2 pt-1 outline-none border border-transparent focus:border-blue-500 rounded-bl-lg'
                />
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
    </>
  )
}

export default SignUp;