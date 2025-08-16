import React from 'react';
import { twMerge } from 'tailwind-merge';
import ImageWithFallback from './ImageWithFallback';

type AvatarProps = {
    width?: number;
    height?: number;
    src: string | undefined;
    additionalStyles?: string;
    alt?: string;
    text?: string;
}

enum DefaultImageSize {
    width = 28,
    height = 28
}

const Avatar = ({
    width = DefaultImageSize.width,
    height = DefaultImageSize.height,
    src,
    additionalStyles,
    alt = "",
    text,
}: AvatarProps) => {
  return (
    <>
    {src ? (
        <span>
            <ImageWithFallback
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={twMerge(`
                    rounded-full
                    bg-white
                    ${additionalStyles}
                `)}
            />
        </span>
    ) : (
        <span
            style={{
                width,
                height
            }}
            className={twMerge(`
                inline-flex
                items-center
                justify-center
                rounded-full
                font-light
                border
                bg-white
                text-stone-300
                ${additionalStyles}
            `)}
        >
            {text}
        </span>
    )}
    </>
  )
}

export default Avatar;