'use client'

import { useAppDispatch } from '@/hooks/hooks';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Input from '../common/Input';
import { DEFAULT_EXTERNAL_LINK, DEFAULT_PRIORITY, DEFAULT_TASK_VALUES, TAGS, MAX_EXTERNAL_LINKS, PRIORITIES, MAX_SUBTASKS } from '@/utils/constants';
import { IProject, IStage, ITask, TeamMember, setCurrentProject } from '@/store/projects/projects.slice';
import { capitalizeFirstLetter, convertToISODate, createNewSubtask, createSearchRegExp, getInvalidLinks, getUniqueLinks, renameLinks, validateUrls } from '@/utils/utils';
import useProjects from '@/hooks/useProjects';
import { Activity, NewTaskData } from '@/utils/interfaces';
import { createTask } from '@/services/projects.api';
import Image from 'next/image';
import { BiPlus, BiTrash } from 'react-icons/bi';
import ButtonWithIcon from '../common/ButtonWithIcon';
import { ExternalLink, Tag, TagName, Priority, SubTask, ActivityType } from '@/utils/types';
import InputLabel from '../common/InputLabel';
import { RxCross2 } from 'react-icons/rx';
import { Tooltip } from '@greguintow/react-tippy';
import Modal from './Modal';
import { twMerge } from 'tailwind-merge';
import AssigneeCard from '../common/AssigneeCard';
import { IUser } from '@/store/auth/auth.slice';
import { GoSearch } from 'react-icons/go';
import useAuth from '@/hooks/useAuth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Line from '../common/Line';
import TaskPriority from '../TaskPriority';
import { setErrorMsg } from '@/store/error/error.slice';
import useModals from '@/hooks/useModals';
import useError from '@/hooks/useError';
import useActivityLog from '@/hooks/useActivityLog';
import { setActivities } from '@/store/activity_log/activity_log.slice';

const NewTaskModal = () => {
    const {isNewTaskModalOpen, closeNewTaskModal} = useModals();
    const {currentProject, currentStage, allTasks} = useProjects();
    const {user, getUserInitials, getUserName} = useAuth();
    const {createNewActivity, activities} = useActivityLog();

    const [selectedPriority, setSelectedPriority] = useState<Priority>(DEFAULT_PRIORITY);
    const [selectedTags, setSelectedTags] = useState<TagName[]>([]);

    const [inputValues, setInputValues] = useState<NewTaskData>(DEFAULT_TASK_VALUES);

    const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([DEFAULT_EXTERNAL_LINK]);

    const {errorMsg, clearError} = useError();

    const dispatch = useAppDispatch();

    const [selectedAssignees, setSelectedAssignees] = useState<TeamMember[]>([]);
    
    const assigneesIds = useMemo(() => selectedAssignees.map(u => u.userId), [selectedAssignees]);
    const assigneesInputRef = useRef<HTMLInputElement>(null);
    
    const [assigneesSearchResults, setAssigneesSearchResults] = useState<TeamMember[]>([]);
    const [assigneesSearchQuery, setAssigneesSearchQuery] = useState<string>("");
    
    const isAssigneesInputDirty = useMemo(() => !!assigneesSearchQuery, [assigneesSearchQuery]);

    const [subtasks, setSubtasks] = useState<SubTask[]>([]);

    const [dependencies, setDependencies] = useState<ITask[]>([]);
    const dependenciesInputRef = useRef<HTMLInputElement>(null);
    const dependenciesIds: string[] = useMemo(() => dependencies.map(task => task.taskId), [dependencies]);

    const [tasksSearchQuery, setTasksSearchQuery] = useState<string>("");
    const [tasksSearchResults, setTasksSearchResults] = useState<ITask[]>([]);
    const isTasksSearchInputDirty = useMemo(() => !!tasksSearchQuery.length, [tasksSearchQuery]);

    const handleCreate = async (newTaskData: NewTaskData): Promise<void> => {
        if (!currentStage) {
            dispatch(setErrorMsg('Failed creating task'));
            return;
        }

        const links: ExternalLink[] = renameLinks(getUniqueLinks(inputValues.externalLinks as ExternalLink[]));

        const linksValid: boolean = validateUrls(links);

        if (!!links[0]?.url && !linksValid) {
            const invalidLinks: ExternalLink[] = getInvalidLinks(links);
            
            dispatch(setErrorMsg(`${invalidLinks.map((l: ExternalLink) => l.name)
                .join(", ")} ${invalidLinks.length > 1
                    ? 'are not valid links'
                    : 'is not a valid link'
                }`
            ));

            return;
        }

        const date = new Date(inputValues.dueDate).toJSON();

        const newTask: NewTaskData = {
            ...newTaskData,
            dueDate: date,
            currentStage: {
                stageId: currentStage?.stageId,
                title: currentStage?.title
            },
            createdBy: user?.userId as string,
        }

        const {data: task} = await createTask(newTask);

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
            stages: updatedStages,
        } as IProject;

        const activityLog =  await createNewActivity(
            ActivityType.AddTask,
            user as IUser,
            currentStage as IStage,
            currentProject?.projectId as string
        );

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

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
        closeNewTaskModal();
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

    const handleUploadChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files?.length) return;

        handleUpload(e.target.files[0]);
    }

    const handleUpload = (file: Blob): void => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64EncodedFile = reader.result as string;
          setInputValues({...inputValues, thumbnailSrc: base64EncodedFile} as NewTaskData);
        }
    }

    const handleRemoveThumbnail = (): void => {
        setInputValues({...inputValues, thumbnailSrc: ''} as NewTaskData);
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
        if (errorMsg) clearError();;

        if (externalLinks.some((l: ExternalLink) => !l.url)) {
            const emptyLinks: ExternalLink[] = externalLinks.filter((l: ExternalLink) => !l.url);

            dispatch(setErrorMsg(`You must fill ${emptyLinks.length > 1
                ? emptyLinks.map((l: ExternalLink) => l.name).join(", ")
                : emptyLinks[0].name} before adding a new one`)
            );

            return;
        }

        if (externalLinks.length === MAX_EXTERNAL_LINKS) {
            dispatch(setErrorMsg(`Cannot add more than ${MAX_EXTERNAL_LINKS} links`));
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

    const handleSearchAssignees = (query: string) => {
        query = query.trim().toLowerCase();

        const newSearchResults = currentProject?.team.filter((u: TeamMember) =>
            (u.firstName.toLowerCase().includes(query)) ||
            (u.lastName.toLowerCase().includes(query))
        );

        if (!!newSearchResults?.length) {
            setAssigneesSearchResults(newSearchResults as IUser[]);
        } else setAssigneesSearchResults([]); 
    }

    const resetAssigneesSearch = () => {
        setAssigneesSearchQuery("");
        setAssigneesSearchResults([]);
    }

    const handleSelectAssignee = (newAssignee: TeamMember) => {
        if (assigneesIds.some(id => id === newAssignee.userId)) {
            assigneesInputRef.current?.focus();
            resetAssigneesSearch();
            return;
        }

        assigneesInputRef.current?.focus();
        setSelectedAssignees([...selectedAssignees, newAssignee]);
        resetAssigneesSearch();
    }

    const handleRemoveAssignee = (assigneeId: string) => {
        setSelectedAssignees([
            ...selectedAssignees.filter(a => a.userId !== assigneeId)
        ]);
    }

    const handleAddSubtask = () => {
        if (subtasks.length === MAX_SUBTASKS) {
            dispatch(setErrorMsg(`Cannot add more than ${MAX_SUBTASKS} subtasks`));
            return;
        }
        
        const newSubtask: SubTask = createNewSubtask(subtasks.length);

        setSubtasks([...subtasks, newSubtask]);
    }

    const handleSubtaskIsDone = (subtaskId: string) => {
        setSubtasks([
            ...subtasks.map(s => s.subtaskId === subtaskId
                ? {
                    ...s,
                    isDone: !s.isDone
                } as SubTask
                : s
        )])
    }

    const handleSubtaskChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const {value, id} = ev.target;

        const subtask = subtasks.find(s => s.subtaskId === id);

        setSubtasks([
            ...subtasks.map(s =>
                s.subtaskId === id
                    ? {
                        ...subtask,
                        title: value
                    } as SubTask
                    : s
            )
        ]);
    }

    const handleRemoveSubtask = (subtaskId: string) => {
        setSubtasks([
            ...subtasks.filter(s => s.subtaskId !== subtaskId)
        ]);
    }

    const handleSubtaskOnBlur = (subtask: SubTask) => {
        if (!subtask.title) {
            handleRemoveSubtask(subtask.subtaskId);
        }
    }

    const searchTasks = (query: string): void => {
        query = query.trim().toLowerCase();

        if (!query.match(/[a-zA-Z0-9]/)) return;

        const regex = createSearchRegExp(query);
        const results: ITask[] = allTasks?.filter(
            (task: ITask) => task.title.match(regex)) as ITask[];

        if (!results && isTasksSearchInputDirty) {
            setTasksSearchResults([]);
            return;
        } else {
            setTasksSearchResults(results);
        }
    }

    const colorMatchedLetters = (text: string, query: string): JSX.Element[] | undefined => {
        query = query.trim();

        if (!query.match(/[a-zA-Z]/)) return;
  
        const regex = createSearchRegExp(query);
        const matchingLetters = text.split(regex).map((part, idx) => (
          <span
            key={idx}
            className={twMerge(`
              text-xl
              text-stone-800
              font-medium
              ${part.match(regex) && 'bg-blue-300'}
            `)}
          >
            {part}
          </span>
        ));
  
        return matchingLetters as JSX.Element[];
    }

    const handleSelectDependency = (task: ITask) => {
        setTasksSearchQuery("");
        dependenciesInputRef.current?.focus();

        if (isDependencySelected(task.taskId)) {
            return;
        } else {
            setDependencies([...dependencies, task]);
        }
    }

    const isDependencySelected = (depId: string): boolean => {
        return dependenciesIds.some(id => id === depId);
    }

    const handleRemoveDependency = (taskId: string) => {
        setDependencies([
            ...dependencies.filter(t => t.taskId !== taskId)
        ]);
    }

    useEffect(() => {
        setInputValues({
            ...inputValues,
            dependencies: dependenciesIds
        } as NewTaskData);
    }, [dependenciesIds])

    useEffect(() => {
        if (tasksSearchQuery) {
            searchTasks(tasksSearchQuery);
            dependenciesInputRef.current?.focus();
        } else setTasksSearchResults([]);
    }, [tasksSearchQuery])

    useEffect(() => {
        setInputValues({
            ...inputValues,
            subtasks
        });
    }, [subtasks])

    useEffect(() => {
        if (assigneesSearchQuery) {
            handleSearchAssignees(assigneesSearchQuery);
        } else {
            resetAssigneesSearch();
        }
    }, [assigneesSearchQuery])

    useEffect(()=> {
        setInputValues({
            ...inputValues,
            assignees: assigneesIds as string[]
        } as ITask);
    }, [assigneesIds])

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
        onClose={closeNewTaskModal}
        optionalNote={`This task will be added to ${currentProject?.title} in ${currentStage?.title}`}
        submitBtnText='Create'
        isOpen={isNewTaskModalOpen}
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
                isRequired
            />

            <Line additionalStyles='mb-4' />
            
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

            <Line additionalStyles='mb-4' />

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

            <Line additionalStyles='mb-4' />

            <div className='w-full flex flex-col gap-2'>
                <InputLabel
                    text='Subtasks'
                    htmlFor='subtasks'
                    isOptional
                />

                {subtasks?.map((sub, idx) => {
                    return (
                        <div key={idx} className='flex gap-1 w-full items-center'>
                            <Input
                                type='checkbox'
                                id={sub.subtaskId}
                                name={sub.title}
                                onChange={() => handleSubtaskIsDone(sub.subtaskId)}
                                additionalStyles='grow-0 accent-green-600'
                            />

                            <Input
                                type='text'
                                id={sub.subtaskId}
                                name={sub.title}
                                onChange={handleSubtaskChange}
                                additionalStyles='grow border-transparent sm:hover:border-slate-200 bg-transparent focus:bg-white'
                                value={sub.title}
                                onBlur={() => handleSubtaskOnBlur(sub)}
                            />

                            <ButtonWithIcon
                                icon={<RxCross2 />}
                                title='Remove'
                                withTooltip={false}
                                action={() => handleRemoveSubtask(sub.subtaskId)}
                            />
                        </div>
                    )
                })}

                <Button
                    type='button'
                    additionalStyles={`
                        text-xl
                        cursor-pointer
                        text-blue-400
                        sm:hover:text-blue-500
                        active:text-blue-500
                        self-start
                        flex
                        items-center
                        gap-1
                        border-none
                        w-fit
                    `}
                    action={handleAddSubtask}
                >
                    <span className='pt-1'>Add subtask</span>
                    <span className='text-sm'><BiPlus /></span>
                </Button>
            </div>

            <Line additionalStyles='mb-4' />

            <div className="relative w-full flex flex-col items-start pb-5">
                <Input
                    type="text"
                    id="searchAssignees"
                    name="searchAssignees"
                    onChange={(ev) => setAssigneesSearchQuery(ev.target.value)}
                    labelText="Assignees"
                    placeholder="Search for assignees..."
                    ref={assigneesInputRef}
                    value={assigneesSearchQuery}
                    searchIcon={<GoSearch />}
                    additionalStyles="grow"
                    withIconInsideInput
                    inputIcon={
                        <ButtonWithIcon
                            withTooltip={false}
                            icon={<RxCross2 />}
                            action={() => setAssigneesSearchQuery("")}
                            additionalStyles="border-none h-full"
                        />
                    }
                />

                {isAssigneesInputDirty && (
                    <div className="absolute top-[65px] max-h-[300px] overflow-y-auto shadow-md z-10 w-full flex flex-col gap-2 border border-slate-200 bg-white">
                        <p className="w-full flex justify-between px-1 text-gray-500">
                            <span>Search results</span>
                            <span>{assigneesSearchResults.length} result{assigneesSearchResults.length === 1 ? "" : "s"}</span>
                        </p>
                        {!!assigneesSearchResults.length
                            ? assigneesSearchResults.map(u => {
                                return (
                                    <div
                                        key={u.userId}
                                        onClick={() => handleSelectAssignee(u)}
                                        className="w-full p-2 flex items-center gap-2 hover:bg-blue-100 border border-transparent hover:border-blue-400 cursor-pointer"
                                    >
                                        <Avatar
                                            src={u.imgSrc}
                                            text={getUserInitials(getUserName(u))}
                                            additionalStyles='w-7 h-7'
                                        />

                                        <p className="font-medium">
                                            {getUserName(u)} {u.userId === user?.userId && '(You)'}
                                        </p>
                                    </div>
                                )
                            }) : <p className="px-2">No results found</p>
                        }
                    </div>
                )}

                {!!selectedAssignees.length && (
                    <div className="flex w-full -gap-1 mt-4 flex-wrap gap-2">
                        {selectedAssignees.map(assignee => {
                            return (
                                <AssigneeCard
                                    assignee={assignee}
                                    key={assignee.userId}
                                    onRemove={() => handleRemoveAssignee(assignee.userId)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            <Line additionalStyles='mb-4' />

            <div className='relative w-full flex flex-col gap-1 mb-5'>
                <Input
                    type='text'
                    id='dependencies'
                    name='dependencies'
                    labelText='Dependencies'
                    onChange={(ev) => setTasksSearchQuery(ev.target.value)}
                    searchIcon={<GoSearch />}
                    value={tasksSearchQuery}
                    placeholder='Search tasks...'
                    additionalStyles='grow'
                    ref={dependenciesInputRef}
                    withIconInsideInput
                    inputIcon={
                        <ButtonWithIcon
                            withTooltip={false}
                            icon={<RxCross2 />}
                            action={() => setTasksSearchQuery("")}
                            additionalStyles="border-none h-full"
                        />
                    }
                />

                {isTasksSearchInputDirty && (
                    <div className="absolute top-[70px] shadow-md z-10 w-full max-h-[300px] overflow-y-auto flex flex-col gap-2 border border-slate-200 bg-white p-1">
                        <p className="w-full flex justify-between px-1 text-gray-500">
                            <span>Search results</span>
                            <span>{tasksSearchResults.length} result{tasksSearchResults.length === 1 ? "" : "s"}</span>
                        </p>

                        {!!tasksSearchResults.length
                            ? tasksSearchResults.map(t => {
                                return (
                                    <Button
                                        type='button'
                                        key={t.taskId}
                                        disabled={isDependencySelected(t.taskId)}
                                        action={() => handleSelectDependency(t)}
                                        additionalStyles='w-full p-1 flex justify-between border border-blue-500 rounded-bl-lg bg-slate-100 cursor-pointer'
                                    >
                                        <p className='text-xl text-stone-800 text-start truncate'>
                                            {colorMatchedLetters(t.title, tasksSearchQuery)}
                                        </p>
                                        
                                        <TaskPriority priority={t.priority} />
                                    </Button>
                                )
                            }) : <p className="px-2">No results found</p>
                        }
                    </div>
                )}

                {!!dependencies.length && (
                    <div className="flex w-full -gap-1 mt-4 flex-wrap gap-2">
                        {!!dependencies.length && (
                            <p className='text-stone-600'>
                                {dependencies.length} {dependencies.length === 1 ? 'dependency' : 'dependencies'}
                            </p>
                        )}

                        {dependencies.map(t => {
                            return (
                                <div
                                    key={t.taskId}
                                    className={`
                                        w-full
                                        p-1
                                        flex
                                        items-center
                                        gap-2
                                        border
                                        rounded-bl-lg
                                        ${t.isDone
                                            ? 'bg-green-200 border-green-400'
                                            : 'bg-gray-200 border-slate-300'
                                        }
                                    `}
                                >
                                    <p className='text-xl px-1 text-stone-800 grow flex items-center text-start truncate'>
                                        {t.title}
                                    </p>
                                    {t.isDone && <p className='italic text-green-500 text-end grow'>COMPLETED</p>}
                                    
                                    <TaskPriority priority={t.priority} />

                                    <ButtonWithIcon
                                        icon={<RxCross2 />}
                                        title='Remove'
                                        withTooltip={false}
                                        additionalStyles='bg-slate-50'
                                        action={() => handleRemoveDependency(t.taskId)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Line additionalStyles='mb-4' />

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

                <Button
                    type='button'
                    additionalStyles={`
                        text-xl
                        cursor-pointer
                        text-blue-400
                        sm:hover:text-blue-500
                        active:text-blue-500
                        self-start
                        flex
                        items-center
                        gap-1
                        border-none
                        w-fit
                    `}
                    action={handleAddLink}
                >
                    <span className='pt-1'>Add link</span>
                    <span className='text-sm'><BiPlus /></span>
                </Button>
            </div>

            <Line additionalStyles='mb-4' />

            <Input
                id='dueDate'
                type='date'
                name='dueDate'
                onChange={handleInputChange}
                value={convertToISODate(inputValues.dueDate) as string}
                labelText='Due date'
                additionalStyles='mb-4'
            />

            <Line additionalStyles='mb-4' />

            <div className='flex gap-1 items-center w-full py-4 flex-wrap'>
                <InputLabel
                    htmlFor="taskPriority"
                    text='Priority'
                    additionalStyles='text-xl block w-full'
                    isRequired
                />

                <div className='w-full flex items-center gap-1'>
                    {PRIORITIES.map((priority: Priority) => {
                        return (
                            <div key={priority} className='w-full flex items-center justify-center'>
                                <Input
                                    hidden
                                    type="radio"
                                    name='taskPriority'
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

            <Line additionalStyles='mb-4' />

            {/* Thumbnail */}
            <div className='flex w-full items-center justify-between'>
                <p className='text-stone-800 text-xl'>Thumbnail</p>

                {inputValues.thumbnailSrc
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

            {inputValues.thumbnailSrc && (
                <Image
                    src={inputValues.thumbnailSrc}
                    width={100} height={60}
                    alt='Thumbnail'
                    className='w-full border border-black rounded-bl-lg'
                />
            )}
        </div>
    </Modal>
  )
}

export default NewTaskModal;