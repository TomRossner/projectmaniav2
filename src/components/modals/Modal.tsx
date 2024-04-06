'use client'

import React, { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ModalTitle from './ModalTitle';
import Line from '../common/Line';
import Button from '../common/Button';
import { useAppDispatch } from '@/hooks/hooks';
import { closeModal } from '@/store/app/app.slice';
import BackLayer from '../common/BackLayer';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
    title: string;
    children: ReactNode;
    onSubmit?: (...args: any) => void;
    onClose: () => void;
    submitBtnText?: string;
    closeBtnText?: string;
    showSubmitBtn?: boolean;
    optionalNote?: string;
    isOpen: boolean;
    submitBtnStyles?: string;
    closeBtnStyles?: string;
    noteBelowContent?: boolean;
    closeOnClickOutside?: boolean;
}

const Modal = ({
    title,
    children,
    onSubmit,
    onClose,
    submitBtnText = 'Submit',
    closeBtnText = 'Cancel',
    showSubmitBtn = true,
    optionalNote,
    isOpen,
    submitBtnStyles,
    closeBtnStyles,
    noteBelowContent = false,
    closeOnClickOutside = false,
} : ModalProps) => {
    const dispatch = useAppDispatch();
    const close = () => dispatch(closeModal());

    const modalRef = useRef(null);

    useEffect(() => {
        const handleMouseClick = (ev: MouseEvent<Element, MouseEvent<Element, MouseEvent>>) => {
            if (closeOnClickOutside && modalRef.current !== ev.target) {
                onClose();
            }
        }

        document.addEventListener("mousedown", (ev) =>
            handleMouseClick(ev as unknown as MouseEvent<Element, MouseEvent<Element, MouseEvent>>)
        );
    }, [])

  return (
    <AnimatePresence>
        {isOpen && (
            <BackLayer title={title}>
                <motion.div 
                    initial={{
                        scale: 0.7,
                        opacity: 0,
                        position: "absolute",
                        left: 0,
                        right: 0,
                        zIndex: title === 'Error' ? 40 : 30,
                        marginBlock: "auto"
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                            duration: 0.05
                        }
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.8,
                        transition: {
                            duration: 0.1
                        }
                    }}
                >
                    <div
                        ref={modalRef}
                        className={`
                            min-w-[350px]
                            max-w-[400px]
                            min-h-24
                            max-h-[95vh]
                            m-auto
                            border
                            border-stone-500
                            bg-slate-100
                            py-3
                            px-4
                            rounded-bl-lg
                            flex
                            flex-col
                            gap-1
                            drop-shadow-md
                            overflow-y-hidden
                        `}
                    >
                        <ModalTitle text={title} />
                        <Line additionalStyles='pb-2' />

                        {children}

                        {noteBelowContent && optionalNote && (
                            <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
                            <span className='font-semibold'>NOTE: </span>
                                {optionalNote}
                            </p>
                        )}

                        <Line additionalStyles='pb-1' /> 
                        <div className='flex items-center gap-1 justify-end'>
                            {showSubmitBtn && (
                                <Button
                                    text={submitBtnText}
                                    action={onSubmit}
                                    additionalStyles={twMerge(`
                                        text-white
                                        bg-blue-400
                                        rounded-bl-lg
                                        hover:bg-blue-500
                                        ${submitBtnStyles}
                                    `)}
                                />
                            )}
                            
                            <Button
                                text={closeBtnText}
                                action={onClose || close}
                                additionalStyles={twMerge(`
                                    text-stone-700
                                    hover:bg-slate-200
                                    ${closeBtnStyles}
                                `)}
                            />
                        </div>

                        {!noteBelowContent && optionalNote && (
                            <p className='italic text-thin text-left pt-2 text-stone-500 w-full'>
                                <span className='font-semibold'>NOTE: </span>
                                {optionalNote}
                            </p>
                        )}
                    </div>
                </motion.div>
            </BackLayer>
        )}
    </AnimatePresence>
  )
}

export default Modal;