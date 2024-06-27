'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import useNewTaskModal from '@/hooks/useModals';
import { closeNewTaskModal, setError } from '@/store/app/app.slice';
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_EXTERNAL_LINK, DEFAULT_PRIORITY, DEFAULT_TASK_VALUES, TAGS, MAX_EXTERNAL_LINKS, PRIORITIES } from '@/utils/constants';
import { IProject, IStage, ITask, setCurrentProject } from '@/store/projects/projects.slice';
import { capitalizeFirstLetter, convertToISODate, getInvalidLinks, getUniqueLinks, renameLinks, validateUrls } from '@/utils/utils';
import useProjects from '@/hooks/useProjects';
import { IBaseTask } from '@/utils/interfaces';
import { createNewTask } from '@/services/projects.api';
import Image from 'next/image';
import { BiPlus, BiTrash } from 'react-icons/bi';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { ExternalLink, Tag, TagName, Priority } from '@/utils/types';
import InputLabel from '../common/InputLabel';
import { RxCross2 } from 'react-icons/rx';
import { Tooltip } from '@greguintow/react-tippy';
import Modal from './Modal';
import { twMerge } from 'tailwind-merge';
import { selectError } from '@/store/app/app.selectors';

const NewTaskModal = () => {
    const {newTaskModalOpen} = useNewTaskModal();
    const {currentProject, currentStage} = useProjects();

    const [selectedPriority, setSelectedPriority] = useState<Priority>(DEFAULT_PRIORITY);
    const [selectedTags, setSelectedTags] = useState<TagName[]>([]);

    const [inputValues, setInputValues] = useState<IBaseTask>(DEFAULT_TASK_VALUES);

    const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([DEFAULT_EXTERNAL_LINK]);

    const error = useAppSelector(selectError);

    const dispatch = useAppDispatch();

    const handleCreate = async (newTaskData: IBaseTask): Promise<void> => {
        if (!currentStage) {
            dispatch(setError('Failed creating task'));
            return;
        }

        const links: ExternalLink[] = renameLinks(getUniqueLinks(inputValues.externalLinks as ExternalLink[]));

        const linksValid: boolean = validateUrls(links);

        if (!!links[0]?.url && !linksValid) {
            const invalidLinks: ExternalLink[] = getInvalidLinks(links);
            
            dispatch(setError(`${invalidLinks.map((l: ExternalLink) => l.name)
                .join(", ")} ${invalidLinks.length > 1
                    ? 'are not valid links'
                    : 'is not a valid link'
                }`
            ));

            return;
        }

        const date = new Date(inputValues.dueDate).toJSON();

        const newTask: Partial<ITask> = {
            ...newTaskData,
            dueDate: date,
            currentStage: {
                stageId: currentStage?.stageId,
                title: currentStage?.title
            },
        }

        const {data: task} = await createNewTask(newTask);

        const updatedStages: IStage[] = currentProject?.stages.map((stage: IStage) => {
            if (currentStage.stageId === stage.stageId) {
                return {
                    ...currentStage,
                    tasks: [...currentStage.tasks, task]
                }
            } else return stage;
        }) as IStage[];

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        /*
        -> Update currentProject ✅
        -> currentProject changed ✅
        -> update stages to be currentProject's stages ✅
        -> stages change ✅
        -> update currentStage to be stage that has the same id ✅
        -> currentStage change ✅
        -> update tasks to be currentStage's tasks ✅
        -> tasks updated, should render in UI
        
        */

        resetInputs();
        dispatch(closeNewTaskModal());
    }

    const resetInputs = (): void => {
        setSelectedPriority(DEFAULT_PRIORITY);
        setInputValues(DEFAULT_TASK_VALUES);
        setSelectedTags([]);
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInputValues({...inputValues, [ev.target.name]: ev.target.value});
    }

    const handleSelectedPriorityChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedPriority(ev.target.value as Priority);
    }

    const setPriorityColor = (priority: Priority): string => {
        switch (priority) {
            case 'low':
                return 'rounded-bl-lg hover:bg-green-400';
            case 'medium':
                return 'rounded-0 hover:bg-yellow-400';
            case 'high':
                return 'rounded-0 hover:bg-red-400'
            default:
                return 'rounded-bl-lg hover:bg-slate-200'
        }
    }

    const isSelected = (priority: Priority): string => {
        switch (priority) {
            case 'low':
                return 'bg-green-400';
            case 'medium':
                return 'bg-yellow-400';
            case 'high':
                return 'bg-red-400';
            default:
                return 'bg-slate-300';

        }
    }

    const handleUploadChange = (e: any): void => {
        if (!e.target.files.length) return;
        handleUpload(e.target.files[0]);
    }

    const handleUpload = (file: any): void => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64EncodedFile = reader.result as string;
          setInputValues({...inputValues, thumbnailSrc: base64EncodedFile} as IBaseTask);
        }
    }

    const handleRemoveThumbnail = (): void => {
        setInputValues({...inputValues, thumbnailSrc: ''} as IBaseTask);
    }

    const handleLinksChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>, index: number = 0): void => {
        setExternalLinks(
            [
                ...externalLinks.map((link: ExternalLink, i: number) =>
                    i === index
                        ?   {
                                ...link,
                                url: value
                            }
                        : link
                    )
            ] as ExternalLink[]);
    }

    const handleRemoveLink = (linkIndex: number): void => {
        setExternalLinks([...externalLinks.filter((extLink: ExternalLink) =>
                externalLinks.indexOf(extLink) !== linkIndex)]);
    }

    const handleAddLink = (): void => {
        if (error) dispatch(setError(null));

        if (externalLinks.some((l: ExternalLink) => !l.url)) {
            const emptyLinks: ExternalLink[] = externalLinks.filter((l: ExternalLink) => !l.url);

            dispatch(setError(`You must fill ${emptyLinks.length > 1
                ? emptyLinks.map((l: ExternalLink) => l.name).join(", ")
                : emptyLinks[0].name} before adding a new one`)
            );

            return;
        }

        if (externalLinks.length === MAX_EXTERNAL_LINKS) {
            dispatch(setError(`Cannot add more than ${MAX_EXTERNAL_LINKS} links`));
            return;
        }
        
        setExternalLinks(
            [
                ...externalLinks,
                {
                    name: `Link #${externalLinks.length + 1}`,
                    url: ""
                }
            ]
        );
    }

    const handleLabelChange = (tag: TagName) => {
        setSelectedTags([...selectedTags, tag]);
    }

    // Add links to inputValues
    useEffect(() => {
        if (externalLinks.length) {
            const links: ExternalLink[] = externalLinks
                .filter((link: ExternalLink) => link.url)
                .map((l: ExternalLink) => (
                    {
                        ...l,
                        url: l.url.trim()
                    }
            ));

            setInputValues(inputValues => ({
                ...inputValues,
                externalLinks: links
            }));
        }
    }, [externalLinks])

    // Add priority to inputValues
    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            priority: selectedPriority
        }));
    }, [selectedPriority])
    
    // Add labels to inputValues
    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            tags: selectedTags
        }));
    }, [selectedTags])

    // Make sure externalLinks is never empty
    useEffect(() => {
        if (!externalLinks.length) setExternalLinks([DEFAULT_EXTERNAL_LINK]);
    }, [externalLinks])
    
  return (
    <Modal
        title='Create a task'
        onSubmit={() => handleCreate(inputValues)}
        onClose={() => dispatch(closeNewTaskModal())}
        optionalNote={`This task will be added to ${currentProject?.title} in ${currentStage?.title}`}
        submitBtnText='Create'
        isOpen={newTaskModalOpen}
    >
        <div className='flex flex-col w-full overflow-y-auto'>
            <Input
                id='title'
                type='text'
                name='title'
                onChange={handleInputChange}
                value={inputValues.title}
                labelText='Title'
                additionalStyles='mb-4'
            />

            <div
                className='flex items-center w-full mt-2 mb-3 justify-between flex-wrap'
            >
                <InputLabel
                    text='Tags'
                    additionalStyles='text-xl block w-full'
                />

                <div className='flex flex-wrap w-fit items-center gap-2'>
                    {TAGS.map((t: Tag, idx: number) => {
                        const {tag, tagColor} = t;
                        return (
                            <div key={idx} className='relative inline-flex overflow-visible'>
                                <input
                                    hidden
                                    type="radio"
                                    name='taskLabels'
                                    id={tag}
                                    value={tag}
                                    onClick={() => handleLabelChange(tag)}
                                />
                                <InputLabel
                                    htmlFor={tag}
                                    text={tag?.toUpperCase()}
                                    additionalStyles={twMerge(`
                                        opacity-70
                                        sm:hover:opacity-100
                                        active:opacity-100
                                        min-w-[40px]
                                        px-4
                                        text-white
                                        border
                                        shadow-sm
                                        text-center
                                        self-stretch
                                        pt-1
                                        cursor-default
                                        select-none
                                        text-base
                                        cursor-pointer
                                        ${idx === 0 && "rounded-bl-lg"}
                                        ${selectedTags?.some(t => t === tag) && 'opacity-100'}
                                    `)}
                                />
                                {selectedTags.some((t: TagName) => t === tag) && (
                                    <Tooltip
                                        title='Remove'
                                        arrow
                                        inertia
                                        duration={150}
                                        animation='scale'
                                        position='top'
                                        size='small'
                                    >
                                        <span
                                            onClick={() => setSelectedTags(selectedTags.filter((t: TagName) => t !== tag))}
                                            className={twMerge(`
                                                rounded-full
                                                bg-gray-400
                                                text-white
                                                text-center
                                                w-4
                                                flex
                                                items-center
                                                justify-center
                                                text-xs
                                                aspect-square
                                                absolute
                                                -top-1.5
                                                -right-1.5
                                                shadow-gray-700
                                                shadow-sm
                                                z-50
                                                cursor-pointer
                                                sm:hover:bg-gray-500
                                                active:bg-gray-500
                                            `)}
                                        >
                                        <RxCross2 />
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <InputLabel
                htmlFor="description"
                text='Description'
                additionalStyles='text-xl block w-full'
            />
            <textarea
                name="description"
                id="description" 
                className='text-lg px-1 outline-none mb-4 border rounded-bl-lg border-stone-300 w-full min-h-20 max-h-40'
                onChange={handleInputChange}
            />

            <div className='flex flex-col items-start gap-4 mb-4 w-full'>
                <InputLabel
                    text='Links'
                    htmlFor='links'
                    isOptional
                    isTitle
                />

                {externalLinks.length === 1
                    ? (
                        <div className='flex items-center pl-4 gap-1 w-full'>
                            <Input
                                id={externalLinks[0].name}
                                type='text'
                                name='links'
                                onChange={handleLinksChange}
                                labelText={`Link #${externalLinks.length}`}
                                placeholder='Add a link...'
                                value={externalLinks[0]?.url}
                                additionalStyles='grow'
                                labelAdditionalStyles='mr-3 text-md font-thin'
                            />
                        </div>
                    ) : externalLinks.map((l: ExternalLink, index: number) => (
                            <div key={index} className='flex items-center pl-4 gap-1 w-full'>
                                <Input
                                    key={index}
                                    id={l.name}
                                    type='text'
                                    name='links'
                                    onChange={(ev) => handleLinksChange(ev, index)}
                                    labelText={`Link #${index + 1}`}
                                    placeholder='Add a link...'
                                    value={l.url}
                                    additionalStyles='grow'
                                    labelAdditionalStyles='mr-3 text-md font-thin'
                                />

                                <ButtonWithIcon
                                    icon={<BiTrash />}
                                    action={() => handleRemoveLink(index)}
                                    title='Remove link'
                                    additionalStyles='sm:hover-text-red-500 active:text-red-500 sm:hover:border-red-500 active:border-red-500'
                                />
                            </div>
                        )
                    )
                }

                <button
                    type='button'
                    className={`
                        text-xl
                        cursor-pointer
                        text-blue-400
                        sm:hover:text-blue-500
                        active:text-blue-500
                        self-start
                        flex
                        items-center
                        gap-1
                    `}
                    onClick={handleAddLink}
                >
                    <span className='pt-1'>Add link</span>
                    <span className='text-sm'><BiPlus /></span>
                </button>
            </div>

            <Input
                id='dueDate'
                type='date'
                name='dueDate'
                onChange={handleInputChange}
                value={convertToISODate(inputValues.dueDate) as string}
                labelText='Due date'
                additionalStyles='mb-4'
            />

            <div className='flex gap-1 items-center w-full py-4 flex-wrap'>
                <InputLabel
                    htmlFor="taskPriority"
                    text='Priority'
                    additionalStyles='text-xl block w-full'
                />

                <div className='w-full flex items-center gap-1'>
                    {PRIORITIES.map((priority: Priority) => {
                        return (
                            <div key={priority} className='w-full flex items-center justify-center'>
                                <input
                                    hidden
                                    type="radio"
                                    name='taskPriority'
                                    key={priority}
                                    id={priority}
                                    value={priority}
                                    onChange={handleSelectedPriorityChange}
                                />

                                <InputLabel
                                    htmlFor={priority}
                                    text={capitalizeFirstLetter(priority)}
                                    title={capitalizeFirstLetter(priority)}
                                    additionalStyles={`
                                        ${priority === selectedPriority
                                            ? isSelected(priority)
                                            : 'bg-gray-300'
                                        }
                                        ${setPriorityColor(priority)}
                                        w-full
                                        border
                                        border-stone-500
                                        px-2
                                        text-white
                                        text-lg
                                        text-center
                                        transition-colors
                                        cursor-pointer
                                    `}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Thumbnail */}
            <div className='flex w-full items-center justify-between'>
                <p className='text-stone-800 text-xl'>Thumbnail</p>
                {
                    inputValues.thumbnailSrc
                        ?   <button
                                type='button'
                                onClick={handleRemoveThumbnail}
                                className={`
                                    text-xl
                                    cursor-pointer
                                    text-blue-400
                                    sm:hover:text-blue-500
                                    active:text-blue-500
                                `}
                            >
                                Remove
                            </button>
                        :   <Input
                                type='file'
                                id='thumbnailSrc'
                                labelText='Upload from my device'
                                name='thumbnailSrc'
                                onChange={handleUploadChange}
                                additionalStyles='hidden'
                                labelAdditionalStyles='cursor-pointer text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
                            />
                }
            </div>
            {
                inputValues.thumbnailSrc && (
                    <Image
                        src={inputValues.thumbnailSrc}
                        width={100} height={60}
                        alt='Thumbnail'
                        className='w-full border border-black rounded-bl-lg'
                    />
                )
            }
        </div>
    </Modal>
  )
}

export default NewTaskModal;