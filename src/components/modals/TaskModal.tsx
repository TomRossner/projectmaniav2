import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import useModals from '@/hooks/useModals';
import { ITask } from '@/store/projects/projects.slice';
import Tag from '../Tag';
import { formatURL, generateId } from '@/utils/utils';
import Input from '../common/Input';
import InputLabel from '../common/InputLabel';
import Line from '../common/Line';
import Button from '../common/Button';
import { BiEdit, BiLinkExternal } from 'react-icons/bi';
import { getUserById } from '@/services/user.api';
import useAuth from '@/hooks/useAuth';
import { IUser } from '@/store/auth/auth.slice';
import Avatar from '../common/Avatar';
import { getHowLongAgo } from '@/utils/dates';
import ModalTitle from './ModalTitle';
import { MdInfoOutline, MdUpdate } from "react-icons/md";
import Link from 'next/link';
import ImageWithFallback from '../common/ImageWithFallback';
import ToolTip from '../common/ToolTip';

type TaskModalProps = {
    task: ITask | null;
}

const TaskModal = ({task}: TaskModalProps) => {
    const {closeTaskModal, openEditTaskModal} = useModals();
    const {getUserName} = useAuth();
    const {isTaskModalOpen, openImageModal} = useModals();
    const [creator, setCreator] = useState<Pick<IUser, "firstName" | "lastName" | "imgSrc"> | null>(null);

    const [assignees, setAssignees] = useState<IUser[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const getAssignees = async (assigneesIds: string[]) => {
        setIsFetching(true);
        const users: IUser[] = [];

        for (const assigneeId of assigneesIds) {
            const response = await getUserById(assigneeId);

            if (response.status !== 200) continue;

            users.push(response.data as IUser);
        }

        setAssignees(users);
        setIsFetching(false);
    }

    useEffect(() => {
        if (task?.assignees.length) {
            getAssignees(task?.assignees);
        }
    }, [task?.assignees])

    const handleEditBtnClick = () => {
        closeTaskModal();

        setTimeout(() => {
            openEditTaskModal();
        }, 100);
    }

    useEffect(() => {
        if (task && !creator) {
            try {
                getUserById(task?.createdBy as string)
                    .then(res => setCreator({
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        imgSrc: res.data.imgSrc
                    })
                );
            } catch (error) {
                setCreator(null);
            }
        }
    }, [task, creator])

  return (
    <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
            closeTaskModal();
            setCreator(null);
        }}
        withCrossIcon
        title={task?.title as string}
        withSubmitBtn={false}
        withCloseBtn={false}
        customTitle={
            <div className='flex w-[90%] items-center justify-between'>
                <ModalTitle text={task?.title as string} />
                <Button
                    withIcon
                    icon={<BiEdit />}
                    action={handleEditBtnClick}
                    additionalStyles='border-none px-2 py-0 w-fit text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
                >
                    Edit
                </Button>
            </div>
        }
    >
        <div className='w-full flex flex-col gap-2 overflow-y-auto'>
            <div className='w-[90%] flex items-center gap-1'>
                {task?.tags.map(t => <Tag key={generateId()} tag={t} />)}
            </div>
            {/* <TaskPriority priority={task?.priority as Priority} additionalStyles='self-start' /> */}

            <Line />

            <p>Description</p>
            {task?.description
                ? <textarea readOnly className='p-2 rounded-bl-lg shadow-inner outline-none shadow-slate-200 min-h-10' value={task?.description} />
                : <p className='italic text-stone-500'>No description</p>
            }

            {task?.thumbnailSrc && (
                <>
                    <Line />

                    <p>Thumbnail</p>
                    <ImageWithFallback
                        onClick={openImageModal}
                        src={task.thumbnailSrc}
                        alt={''}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{objectFit:"cover"}}
                        className='rounded-bl-lg w-full max-h-36 cursor-pointer'
                    />
                </>
            )}

            <Line />

            <p>Links</p>
            <div className='w-full flex flex-col gap-1'>
                {task?.externalLinks.length
                    ? task?.externalLinks.map((ext, idx) => (
                        <Link
                            href={formatURL(ext.url) as string}
                            key={idx}
                            target='_blank'
                            rel='noreferrer noopener'
                            className={`
                                cursor-pointer
                                flex
                                items-center
                                justify-between
                                gap-1
                                px-2
                                w-full
                                text-md
                                even:bg-slate-100
                                odd:bg-slate-200
                                text-blue-400
                                sm:hover:text-blue-500
                                sm:hover:bg-slate-100
                                active:text-blue-500
                            `}
                        >
                            <span className='w-full truncate'>{formatURL(ext.url)}</span>
                            
                            <span className='text-lg' title={`Go to ${formatURL(ext.url)}`}>
                                <BiLinkExternal />
                            </span>
                        </Link>
                    )) : <p className='italic text-stone-500'>None</p>
                }
            </div>

            <Line />

            <p>Subtasks</p>
            {!!task?.subtasks.length
                ?   <>
                        {task?.subtasks.map((s, i) => (
                            <div key={s.subtaskId} className='flex gap-2 items-center w-full'>
                                <span className='px-2.5 py-1 bg-slate-200 font-semibold rounded-bl-lg text-center'>{i + 1}</span>
                                <InputLabel
                                    htmlFor={s.title}
                                    isTitle
                                    text={s.title}
                                    title={s.title}
                                    additionalStyles='font-light overflow-x-hidden'
                                />
                                <Input
                                    key={s.subtaskId}
                                    id={s.subtaskId}
                                    isReadOnly
                                    type='checkbox'
                                    name={s.title}
                                    value={s.title}
                                    additionalStyles='accent-green-600'
                                    onChange={() => {}}
                                    isChecked={s.isDone}
                                />
                            </div>
                        ))}
                    </>
                : <p className='italic text-stone-500'>None</p>
            }

            <Line />

            <p>Assignees</p>
            {!!task?.assignees.length ? (
                <>
                    {isFetching ? (
                        <div className='w-full flex items-center gap-1'>
                            {task.assignees.map(a => (
                                <span key={a} className='w-7 h-7 rounded-full animate-pulse bg-gray-300' />
                            ))}
                        </div>
                    ) : (

                        <div className='flex items-center gap-1 w-full'>
                            {assignees.map(a => (
                                <Avatar
                                    key={generateId()}
                                    src={a.imgSrc}
                                    text={getUserName(a as IUser)}
                                />
                                )
                            )}
                        </div>
                    )}
                </>
            ) : <p className='italic text-stone-500'>None</p>}

            <Line />

            <div className='flex items-center gap-2 w-full'>
                <span className='text-xl text-blue-500'><MdUpdate /></span>
                <p className='grow'>
                    Last updated {getHowLongAgo(!!task?.updatedAt ? task?.updatedAt as Date : task?.createdAt as Date)}
                </p>
                {!task?.updatedAt && (
                    <ToolTip
                        title="This task hasn't been modified. Displaying the elapsed time since its' creation."
                        className='text-xl text-slate-400'
                    >
                        <MdInfoOutline />
                    </ToolTip>
                )}    
            </div>

            <Line />

            {creator && task?.createdAt && (
                <p className='flex items-start italic text-stone-500 gap-2'>
                    <Avatar src={creator.imgSrc} width={20} height={20} additionalStyles='text-black' />
                    Created by {`${creator.firstName} ${creator.lastName}`} on {String(new Date(task?.createdAt as Date).toLocaleDateString())} ({getHowLongAgo(task?.createdAt as Date)})
                </p>
            )}
        </div>
    </Modal>
  )
}

export default TaskModal;