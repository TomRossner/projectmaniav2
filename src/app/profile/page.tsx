'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import isAuth from '../ProtectedRoute';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { IUser } from '@/store/auth/auth.slice';
import { BiBell, BiEdit } from 'react-icons/bi';
import { twMerge } from 'tailwind-merge';
import ImageModal from '@/components/modals/ImageModal';
import useModals from '@/hooks/useModals';
import Input from '@/components/common/Input';
import Line from '@/components/common/Line';
import InputLabel from '@/components/common/InputLabel';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/hooks';
import { updateUserData } from '@/services/user.api';
import { setErrorMsg } from '@/store/error/error.slice';
import Button from '@/components/common/Button';

const Profile = () => {
  const {user, fullName} = useAuth();
  const {openImageModal, isImageModalOpen} = useModals();
  const [imgSrc, setImgSrc] = useState('');
  const dispatch = useAppDispatch();

  const {
    notifications,
    email,
    createdAt,
    isOnline,
  } = user as IUser;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    handleUpload(e.target.files[0]);
  }

  const handleUpload = async (file: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64EncodedFile = reader.result as string;

        const response = await updateUserData({
          ...user,
          imgSrc: base64EncodedFile
        } as IUser);
        
        if (response.status !== 200) {
          throw new Error('Failed uploading image');
        }
        
        return setImgSrc(base64EncodedFile);
      }
    } catch (error) {
      console.error(error);
      dispatch(setErrorMsg(typeof error === 'string'
        ? error
        : 'Failed uploading image'
      )); 
    }
  }

  useEffect(() => {
    setImgSrc(user?.imgSrc as string);
  }, [user]);

  return (
    <Container id='profilePage'>
      <ImageModal
        isOpen={isImageModalOpen}
        image={
          <Image
            src={imgSrc}
            alt={fullName}
            width={200}
            height={200}
            className={`w-full rounded-sm`}
          />
        }
      />

      <div className='flex justify-between w-full items-center'>
        <Header text='My Profile' additionalStyles='mb-3' />
        <Button
          withIcon
          icon={<BiEdit />}
          action={() => {}}
          disabled={!user}
          additionalStyles='self-start w-fit px-2 py-0 border-none text-blue-400 sm:hover:text-blue-500 active:text-blue-500'   
        >
          Edit profile
        </Button>
      </div>

      {!!notifications.length && (
        <p className='rounded-lg w-full bg-blue-400 px-5 py-2 text-center text-lg text-white font-light flex items-center gap-2'>
          <span className='flex items-center justify-start'>
            <BiBell />
          </span>
          You have <b>{notifications.length}</b> new notification{notifications.length === 1 ? '' : 's'}. <Link href={'/notifications'} className='underline'>Click here to see your notifications.</Link>
          <div className='grow' />
        </p>
      )}

      <div className='w-full flex gap-5 items-start py-5'>
        <div
          className={twMerge(`
            relative
            flex
            items-center
            justify-center
            rounded-full
            w-24
            h-24
          `)}
        >
          <Image
            src={imgSrc}
            alt={fullName}
            width={100}
            height={100}
            onClick={openImageModal}
            className={twMerge(`
              rounded-full
              cursor-pointer
            `)
          }
          />

          <InputLabel
            htmlFor='image'
            withIcon
            icon={<BiEdit />}
            additionalStyles={`
              bg-white
              p-1
              border
              border-stone-500
              cursor-pointer
              absolute
              rounded-full
              z-10
              bottom-0.5
              right-0.5
              opacity-100
              bg-white
              border
              border-blue-400
              text-blue-400
              active:bg-blue-400
              active:text-white
              sm:hover:text-white
              sm:hover:bg-blue-400
              transition-colors
              duration-100
            `}
          />
          <Input
            hidden
            type='file'
            id='image'
            name='image'
            onChange={handleImageChange}
            accept='image/*'
            multiple={false}
          />
        </div>
        
        <div className='flex flex-col grow'>
          <p className='text-2xl font-semibold text-stone-700 flex gap-3'>
            {fullName}
            {/* <span
              className={twMerge(`
                px-2
                py-0.5
                text-center
                rounded-bl-lg
                w-fit
                text-base
                font-normal
                ${isOnline ? 'text-green-400 bg-green-100' : 'text-red-400 bg-red-100'}
              `)}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span> */}
            <span className='text-stone-400 font-light text-lg self-end'>{email}</span>
          </p>

          {/* <p className='text-lg text-stone-400'>{email}</p> */}
          <Line />

          <div className='h-9 grow' />
          
          <p className='text-md text-stone-600'>Member since {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* <div className='flex gap-2'>
        <Input
          labelText='Email'
          id='email'
          name='email'
          onChange={() => {}}
          type='email'
          placeholder={email}
          isReadOnly
          additionalStyles='border-none outline-none'
        />
      </div> */}

    </Container>
  )
}

export default isAuth(Profile);