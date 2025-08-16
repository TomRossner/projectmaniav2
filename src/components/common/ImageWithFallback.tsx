import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'width' | 'height'> {
    src: string;
    fallbackSrc?: string;
    withAlt?: boolean;
    height?: number;
    width?: number;
    fill?: boolean;
}

const defaultImage: string = "/assets/defaultProfilePic.jpg";

const DEFAULT_IMAGE_WIDTH: number = 1080;
const DEFAULT_IMAGE_HEIGHT: number = 720;

const ImageWithFallback = ({
    src,
    withAlt = false,
    fallbackSrc = defaultImage,
    alt = '',
    width = DEFAULT_IMAGE_WIDTH,
    height = DEFAULT_IMAGE_HEIGHT,
    fill = false,
    ...props
}: ImageWithFallbackProps) => {
    const [imgSrc, setImgSrc] = useState<string>(src);

    const handleError = () => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    }

    return (
        <Image
            {...props}
            width={!fill ? width : 0}
            height={!fill ? height : 0}
            src={imgSrc}
            fill={fill}
            alt={withAlt ? alt : ''}
            onError={handleError}
        />
    )
}

export default ImageWithFallback;