'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import isAuth from '../ProtectedRoute';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import useAuth from '@/hooks/useAuth';
import { IUser, setUser } from '@/store/auth/auth.slice';
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
import { capitalizeFirstLetter, createFileName, getImageContentType } from '@/utils/utils';
import { uploadImageToS3 } from '@/services/images.api';
import { IMAGE_MAX_SIZE } from '@/utils/constants';
import Loading from '@/components/common/Loading';
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { IoMdKey } from "react-icons/io";
import ImageWithFallback from '@/components/common/ImageWithFallback';
import useError from '@/hooks/useError';

const Profile = () => {
  const {user, fullName} = useAuth();
  const {openImageModal, isImageModalOpen} = useModals();
  const [imgSrc, setImgSrc] = useState('');
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const {errorMsg} = useError();

  const {
    notifications,
    email,
    createdAt,
    isOnline,
    authProvider
  } = user as IUser;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) dispatch(setErrorMsg(null));

    if (!e.target.files?.length) return;

    handleUpload(e.target.files[0]);
  }

  const handleUpload = async (file: Blob) => {
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        setIsUploading(true);

        const base64EncodedFile = reader.result as string;
        const contentType = getImageContentType(base64EncodedFile);
        const fileName = createFileName(user, 'user');
        
        if (!contentType || !fileName) {
          throw new Error('Failed uploading image');
        }
        
        try {
            const imageUpdateResponse = await uploadImageToS3(base64EncodedFile, fileName, contentType);
            
            const updateUserResponse = await updateUserData({
              ...user,
              imgSrc: imageUpdateResponse.data,
            } as IUser);
            
            dispatch(setUser(updateUserResponse.data));
            setImgSrc(updateUserResponse.data.imgSrc);
          } catch (error) {
            console.error(error);

            dispatch(setErrorMsg(`Failed uploading image. Make sure the image's size does not exceed ${IMAGE_MAX_SIZE}`));
          } finally {
            setIsUploading(false);
          }
      }
    } catch (error: any) {
      console.error(error);
      dispatch(setErrorMsg(error)); 
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    console.log(user)
    setImgSrc(user?.imgSrc as string);
  }, [user]);

  return (
    <Container id='profilePage'>
      <ImageModal
        isOpen={isImageModalOpen}
        image={!!imgSrc && (
          <ImageWithFallback
            src={imgSrc}
            alt={''}
            width={200}
            height={200}
            className={'w-full rounded-sm'}
          />
        )}
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
        <p className='rounded-lg w-full bg-blue-400 px-3 py-2 text-center text-white font-light flex items-center gap-1 text-nowrap'>
          <span className='flex items-center justify-start'>
            <BiBell />
          </span>
          You have <b>{notifications.length}</b> new notification{notifications.length === 1 ? '' : 's'}. <Link href={'/notifications'} className='underline'>Click here to see your notifications.</Link>
          <span className='grow' />
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
            border border-blue-500
          `)}
        >
          {isUploading && (
            <div className='flex items-center justify-center w-full z-10'>
              <Loading
                imageStyles='mt-0 my-auto'
                width={30}
                height={30}
              />
            </div>
          )}
          {!!imgSrc ? (
            <ImageWithFallback
              src={imgSrc}
              alt=''
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{objectFit:"cover"}}
              onClick={openImageModal}
              className={twMerge(`
                rounded-full
                cursor-pointer
                ${isUploading && 'opacity-50'}
              `)}
            />
          ) : (
            <span
              className={twMerge(`
                inline-flex
                items-center
                justify-center
                rounded-full
                w-24
                h-24
                border
                bg-slate-100
                text-stone-400
                text-4xl
                font-semibold
                ${isUploading && 'opacity-50'}
              `)}
            >
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </span>
          )}

          <ButtonWithIcon
            disabled={isUploading}
            action={() => {}}
            withTooltip={false}
            title='Upload image'
            icon={
              <InputLabel
                htmlFor='image'
                withIcon
                icon={<BiEdit />}
                additionalStyles='cursor-pointer'
              />
            }
            disabledStyles='disabled:border-blue-400 disabled:text-blue-300'
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
            accept='image/png, image/jpeg'
            multiple={false}
          />
        </div>
        
        <div className='flex flex-col grow'>
          <p className='text-2xl font-semibold text-stone-700 flex flex-col'>
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
            <span className='text-stone-400 font-light text-lg'>{email}</span>
          </p>

          {/* <p className='text-lg text-stone-400'>{email}</p> */}
          {/* <Line additionalStyles='mb-4' /> */}



          {/* <div className='h-6 grow' /> */}
          
        </div>
      </div>

      <Line additionalStyles='mb-3' />

      <div className='w-full flex items-center justify-between'>
        {authProvider && (
          <div className='flex gap-1 items-center px-1.5 py-0.5 bg-slate-100 rounded-lg'>
            <span className='text-blue-500 text-xl px-1 py-0.5 bg-slate-200 rounded-lg'>
              <IoMdKey />
            </span>

            <span
              className={twMerge(`
                px-1
                py-0.5
                text-center
                rounded-lg
                w-fit
                text-base
                font-normal
                text-slate-800
              `)}
            >
              {authProvider === "local"
                ? "Email & password"
                : capitalizeFirstLetter(authProvider as string)
              }
            </span>
          </div>
        )}

        <p className='text-md text-stone-600 grow text-end'>Member since {new Date(createdAt).toLocaleDateString()}</p>
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