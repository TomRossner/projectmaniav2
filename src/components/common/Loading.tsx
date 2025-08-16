import React from 'react';
import Image from 'next/image';
import loadingBlue from "../../assets/loading-blue.png";
import { twMerge } from 'tailwind-merge';

type LoadingProps = {
  text?: string;
  width?: number;
  height?: number;
  withText?: boolean;
  imageStyles?: string;
  textStyles?: string;
}

const Loading = ({
  text,
  width = 50,
  height = 50,
  withText = false,
  textStyles,
  imageStyles,
}: LoadingProps) => {
  return (
    <>
        <Image
            src={loadingBlue}
            alt='Loading'
            width={width}
            height={height}
            className={twMerge(`
              aspect-square
              animate-spin
              w-fit
              mx-auto
              mt-12
              mb-4
              ${imageStyles}
            `)}
        />
        
        {withText && (
          <p className={twMerge(`text-xl text-stone-800 text-center w-full ${textStyles}`)}>
            {text}
          </p>
        )}
    </>
  )
}

export default Loading;