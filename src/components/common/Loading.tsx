import React from 'react';
import Image from 'next/image';
import loadingBlue from "../../assets/loading-blue.png";

type LoadingProps = {
  text?: string;
  width?: number;
  height?: number;
  withText?: boolean;
}

const Loading = ({
  text,
  width = 50,
  height = 50,
  withText = false,
}: LoadingProps) => {
  return (
    <>
        <Image
            src={loadingBlue}
            alt='Loading'
            width={width}
            height={height}
            className='aspect-square animate-spin w-fit mx-auto mt-12 mb-4'
        />
        
        {withText && (
          <p className='text-xl text-stone-800 text-center'>
            {text}
          </p>
        )}
    </>
  )
}

export default Loading;