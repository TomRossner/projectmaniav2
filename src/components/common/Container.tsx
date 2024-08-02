import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ContainerProps = {
    children: ReactNode;
    id?: string;
    className?: string;
}

const Container = ({
    id,
    children,
    className
}: ContainerProps) => {
  return (
    <div
        id={id}
        className={twMerge(
            `
            p-4
            flex
            flex-col
            h-[90vh]
            `,
            className,
        )}
    >
        {children}
    </div>
  )
}

export default Container;