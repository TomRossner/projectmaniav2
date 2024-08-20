import useOnClickOutside from '@/hooks/useOnClickOutside';
import { ExternalLink } from '@/utils/types';
import { formatURL } from '@/utils/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { RefObject, useRef } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import ClickAwayListener from 'react-click-away-listener';

type TaskLinksProps = {
    links: ExternalLink[];
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
}

const TaskLinks = (props: TaskLinksProps) => {
    const {
        isOpen,
        setIsOpen,
        links,
    } = props;

    const linksRef = useRef<HTMLElement>(null);

    // useOnClickOutside(linksRef, () => setIsOpen(false));

  return (
    <AnimatePresence>
        {isOpen && !!links.length && (
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <motion.div
                    initial={{
                        opacity: 0,
                        zIndex: 20,
                        marginBlock: "auto"
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: 0.08
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.1
                        }
                    }}
                >
                <div
                    ref={linksRef as RefObject<HTMLDivElement>}
                    className={`
                        w-[220px]
                        sm:w-[270px]
                        absolute
                        bottom-8
                        sm:bottom-2
                        left-[10%]
                        sm:left-[90%]
                        flex
                        flex-col
                        items-start
                        py-1
                        shadow-md
                        border
                        border-slate-300
                        bg-slate-50
                        z-40
                    `}
                >
                    {links.map((link: ExternalLink, index: number) => {
                        return (
                            <Link
                                key={index}
                                href={formatURL(link.url) as string}
                                target='_blank'
                                rel='noreferrer noopener'
                                className={`
                                    cursor-pointer
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                    px-2
                                    w-full
                                    text-md
                                    text-blue-400
                                    sm:hover:text-blue-500
                                    sm:hover:bg-slate-100
                                    active:text-blue-500
                                `}
                            >
                                <span className='pt-1 w-full truncate'>{formatURL(link.url)}</span>
                                
                                <span className='text-lg' title={`Go to ${formatURL(link.url)}`}>
                                <BiLinkExternal />
                                </span>
                            </Link>
                        )
                    })}
                </div>
                </motion.div>
            </ClickAwayListener>
        )}
    </AnimatePresence>
  )
}

export default TaskLinks;