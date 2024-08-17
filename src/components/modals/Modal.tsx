'use client'

import React, { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ModalTitle from './ModalTitle';
import Line from '../common/Line';
import Button from '../common/Button';
import BackLayer from '../common/BackLayer';
import { twMerge } from 'tailwind-merge';
import ModalNote from './ModalNote';
import { RxCross2 } from 'react-icons/rx';
import ButtonWithIcon from '../common/ButtonWithIcon';

type ModalProps = {
    title: string;
    children: ReactNode;
    onSubmit?: (...args: any) => void;
    onClose: () => void;
    submitBtnText?: string;
    closeBtnText?: string;
    withSubmitBtn?: boolean;
    optionalNote?: string;
    isOpen: boolean;
    submitBtnStyles?: string;
    closeBtnStyles?: string;
    noteBelowContent?: boolean;
    closeOnClickOutside?: boolean;
    withCrossIcon?: boolean;
    withCloseBtn?: boolean;
    isLoadingModal?: boolean;
    additionalStyles?: string;
}

const Modal = ({
    title,
    children,
    onSubmit,
    onClose,
    submitBtnText = 'Submit',
    closeBtnText = 'Cancel',
    withSubmitBtn = true,
    optionalNote,
    isOpen,
    submitBtnStyles,
    closeBtnStyles,
    noteBelowContent = false,
    closeOnClickOutside = false,
    withCrossIcon = false,
    withCloseBtn = true,
    isLoadingModal = false,
    additionalStyles,
} : ModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMouseClick = (ev: MouseEvent<Element, MouseEvent<Element, MouseEvent>>) => {
            if (closeOnClickOutside && !modalRef.current?.contains(ev.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", (ev) =>
            handleMouseClick(ev as unknown as MouseEvent<Element, MouseEvent<Element, MouseEvent>>)
        );
    }, [closeOnClickOutside, onClose])

  return (
    <AnimatePresence>
        {isOpen && (
            <BackLayer title={title}>
                {isLoadingModal ? (
                    <motion.div
                        className={twMerge(`
                            w-[95%]
                            xs:max-w-sm
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
                            relative
                            ${title === 'Error' ? "z-40" : "z-30"}
                            ${additionalStyles}
                        `)}
                        ref={modalRef}
                        initial={{
                            scale: 0.7,
                            opacity: 0,
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
                        {children}
                    </motion.div>
                ) : (
                    <motion.div
                        className={twMerge(`
                            w-[95%]
                            xs:max-w-sm
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
                            relative
                            ${title === 'Error' ? "z-40" : "z-30"}
                            ${additionalStyles}
                        `)}
                        ref={modalRef}
                        initial={{
                            scale: 0.7,
                            opacity: 0,
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
                        <ModalTitle text={title} />

                        {withCrossIcon && (
                            <ButtonWithIcon
                                action={onClose || close}
                                icon={<RxCross2 />}
                                additionalStyles='absolute end-2 top-2 bg-white'
                                title='Close'
                            />
                        )}

                        {!!title.length && <Line additionalStyles='pb-2' />}

                        {children}

                        {noteBelowContent && optionalNote && (
                            <ModalNote note={optionalNote} />
                        )}

                        {withSubmitBtn && withCloseBtn && (
                            <Line additionalStyles='pb-1' />
                        )}
                        
                        <div className='flex items-center gap-1 w-full'>
                            {withSubmitBtn && (
                                <Button
                                    action={onSubmit}
                                    additionalStyles={twMerge(`
                                        text-white
                                        bg-blue-400
                                        rounded-bl-lg
                                        hover:bg-blue-500
                                        w-full
                                        ${submitBtnStyles}
                                    `)}
                                >
                                    {submitBtnText}
                                </Button>
                            )}
                            
                            {withCloseBtn && (
                                <Button
                                    action={onClose}
                                    additionalStyles={twMerge(`
                                        text-stone-700
                                        hover:bg-slate-200
                                        w-full
                                        bg-white
                                        ${!withSubmitBtn && "rounded-bl-lg"}
                                        ${closeBtnStyles}
                                    `)}
                                >
                                    <span className='pt-1'>{closeBtnText}</span>
                                </Button>
                            )}
                        </div>

                        {!noteBelowContent && optionalNote && (
                            <ModalNote note={optionalNote} />
                        )}
                    </motion.div>
                )}
                
            </BackLayer>
        )}
    </AnimatePresence>
  )
}

export default Modal;