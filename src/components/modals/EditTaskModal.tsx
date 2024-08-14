"use client"

import { useAppDispatch } from "@/hooks/hooks";
import useProjects from "@/hooks/useProjects";
import { IProject, IStage, ITask, TeamMember, setCurrentProject } from "@/store/projects/projects.slice";
import { LINKS } from "@/utils/links";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Input from "../common/Input";
import useModals from "@/hooks/useModals";
import { capitalizeFirstLetter, convertToISODate, createNewSubtask, getDuplicatedLinks, getInvalidLinks, getUniqueLinks, renameLinks, validateUrls } from "@/utils/utils";
import { DEFAULT_EXTERNAL_LINK, DEFAULT_PRIORITY, MAX_EXTERNAL_LINKS, MAX_SUBTASKS, PRIORITIES, TAGS } from "@/utils/constants";
import InputLabel from "../common/InputLabel";
import ButtonWithIcon from "../common/ButtonWithIcon";
import { BiPlus, BiTrash } from "react-icons/bi";
import { ActivityType, ExternalLink, NewSubTask, Priority, SelectedStage, SubTask, TagName } from "@/utils/types";
import { RxCross2 } from "react-icons/rx";
import { Tag } from "@/utils/types";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";
import ErrorModal from "./ErrorModal";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../common/Button";
import { IUser } from "@/store/auth/auth.slice";
import { GoSearch } from "react-icons/go";
import useAuth from "@/hooks/useAuth";
import AssigneeCard from "../common/AssigneeCard";
import Avatar from "../common/Avatar";
import Line from "../common/Line";
import { setErrorMsg } from "@/store/error/error.slice";
import { setActivities } from "@/store/activity_log/activity_log.slice";
import useActivityLog from "@/hooks/useActivityLog";
import { getSocket } from "@/utils/socket";

type EditTaskModalProps = {
    task: ITask;
}

const EditTaskModal = ({task}: EditTaskModalProps) => {
    const dispatch = useAppDispatch();

    const [selectedPriority, setSelectedPriority] = useState<Priority>(DEFAULT_PRIORITY);
    const [selectedTags, setSelectedTags] = useState<TagName[]>([]);

    const {currentProject, currentTask} = useProjects();
    const {isEditTaskModalOpen, closeEditTaskModal} = useModals();
    const {createNewActivity, activities} = useActivityLog();
    const {user, getUserInitials, getUserName} = useAuth();
    const socket = getSocket();

    const DEFAULT_VALUES: ITask = task;

    const [inputValues, setInputValues] = useState<ITask | null>(null);

    const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([DEFAULT_EXTERNAL_LINK]);

    const [selectedStage, setSelectedStage] = useState<SelectedStage | null>(null);

    const duplicatedLinks = useMemo(() => {
        return !!inputValues?.externalLinks.length &&
            !!getDuplicatedLinks(inputValues?.externalLinks as ExternalLink[]).length;
    }, [inputValues?.externalLinks]);

    const [selectedAssignees, setSelectedAssignees] = useState<TeamMember[]>([]);
    
    const assigneesIds = useMemo(() => selectedAssignees.map(u => u.userId), [selectedAssignees]);
    const assigneesInputRef = useRef<HTMLInputElement>(null);
    
    const [assigneesSearchResults, setAssigneesSearchResults] = useState<TeamMember[]>([]);
    const [assigneesSearchQuery, setAssigneesSearchQuery] = useState<string>("");
    
    const isAssigneesInputDirty = useMemo(() => !!assigneesSearchQuery, [assigneesSearchQuery]);

    const [subtasks, setSubtasks] = useState<SubTask[]>([]);

    const handleUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;

        if (!files || !files.length) return;

        handleUpload(files[0]);
    }

    const handleUpload = (file: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64EncodedFile = reader.result as string;
          setInputValues({
            ...inputValues,
            thumbnailSrc: base64EncodedFile
          } as ITask);
        }
    }

    const closeModal = useCallback(() => {
        resetAssigneesSearch();
        setSelectedStage(null);
        setInputValues(DEFAULT_VALUES);
        closeEditTaskModal();
    }, [DEFAULT_VALUES, closeEditTaskModal])

    const getUpdatedStages = useCallback((inputValues: ITask, project: IProject): IStage[] | void => {
        if (!project || !inputValues) {
            dispatch(setErrorMsg('Failed to update project'));
            return;
        }

        const updatedTask: ITask = {
            ...task,
            ...inputValues,
            externalLinks: inputValues.externalLinks,
            currentStage: inputValues.currentStage
        } as ITask;

        if (inputValues.currentStage?.stageId !== task.currentStage?.stageId) {
            const stageToRemoveTaskFrom: IStage | undefined = project?.stages.find(s => s.tasks.some(t => t.taskId === task.taskId));
            const stageToAddTaskTo: IStage | undefined = project?.stages.find(s => s.stageId === selectedStage?.stageId);

            if (stageToRemoveTaskFrom && stageToAddTaskTo) {
                const filteredStage = {
                    ...stageToRemoveTaskFrom,
                    tasks: stageToRemoveTaskFrom.tasks.filter(t => t.taskId !== task.taskId)
                } as IStage;

                const updatedSelectedStage = {
                    ...stageToAddTaskTo,
                    tasks: [
                        ...stageToAddTaskTo.tasks,
                        updatedTask
                    ]
                } as IStage;

                const updatedStages: IStage[] = project?.stages.map(s => {
                    if (s.stageId === filteredStage.stageId) {
                        return filteredStage;
                    } else if (s.stageId === updatedSelectedStage.stageId) {
                        return updatedSelectedStage;
                    } else return s;
                }) as IStage[];

                return updatedStages;
            }
        } else {
            const updatedStages: IStage[] = currentProject?.stages.map((stage: IStage) => {
                if (stage.stageId === task.currentStage?.stageId) {
    
                    const updatedTasks: ITask[] = stage.tasks.map(
                        (t: ITask) => {
                            if (t.taskId === task.taskId) {
                                return updatedTask;
                            } else return t;
                        }
                    );
    
                    return {
                        ...stage,
                        tasks: updatedTasks
                    };
                } else return stage;
            }) as IStage[];

            return updatedStages;
        }

        dispatch(setErrorMsg('Failed to update project'));
        return project.stages;
    }, [task, currentProject?.stages, selectedStage?.stageId, dispatch]);

    const handleSave = useCallback(async (ev: FormEvent<HTMLFormElement>, updatedValues: ITask) => {
        ev.preventDefault();

        if (!updatedValues) return;

        dispatch(setErrorMsg(null));
        
        if (updatedValues.externalLinks && updatedValues.externalLinks.length) {
            const updatedLinks: ExternalLink[] = renameLinks(getUniqueLinks(updatedValues.externalLinks));

            updatedValues = {
                ...updatedValues,
                externalLinks: updatedLinks
            } as ITask;

            const linksValid: boolean = validateUrls(updatedLinks);
    
            if (!!updatedLinks[0]?.url && !linksValid) {
                const invalidLinks: ExternalLink[] = getInvalidLinks(updatedLinks);
    
                dispatch(setErrorMsg(`${invalidLinks.map((l: ExternalLink) => l.name)
                    .join(", ")} ${invalidLinks.length > 1
                        ? "are not valid links"
                        : "is not a valid link"
                    }`
                ));
    
                return;
            }
        }

        const updatedTask: ITask = {
            ...updatedValues,
            lastUpdatedBy: user?.userId as string,
        }
        
        const updatedStages = getUpdatedStages(updatedTask, currentProject as IProject);

        const updatedCurrentProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        const activityLog =  await createNewActivity(
            ActivityType.UpdateTask,
            user as IUser,
            currentTask as ITask,
            currentProject?.projectId as string
        );

        // dispatch(setCurrentTask(updatedValues));
        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));

        socket?.emit('updateTask', updatedTask);

        closeModal();
    }, [
        activities,
        closeModal,
        createNewActivity,
        currentProject,
        currentTask,
        user,
        getUpdatedStages,
        dispatch
    ]);

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const updatedValues = {
            ...inputValues,
            [ev.target.name]: ev.target.value
        };

        setInputValues(updatedValues as ITask);
    }

    const handleSelectedPriorityChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedPriority(ev.target.value as Priority);
    }

    const setPriorityColor = (priority: Priority): string => {
        switch (priority) {
            case "low":
                return "rounded-bl-lg hover:bg-green-400";
            case "medium":
                return "rounded-0 hover:bg-yellow-400";
            case "high":
                return "rounded-0 hover:bg-red-400"
            default:
                return "rounded-bl-lg hover:bg-slate-200"
        }
    }

    const isSelected = (priority: Priority): string => {
        switch (priority) {
            case "low":
                return "bg-green-400";
            case "medium":
                return "bg-yellow-400";
            case "high":
                return "bg-red-400";
            default:
                return "bg-slate-300";

        }
    }

    const handleRemoveThumbnail = () => {
        setInputValues({
            ...inputValues,
            thumbnailSrc: ""
        } as ITask);
    }

    const handleLinksChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>, index: number = 0): void => {
        setExternalLinks(externalLinks => (
            [
                ...externalLinks.map((link: ExternalLink, i: number) =>
                    i === index
                        ?   {
                                ...link,
                                url: value
                            }
                        : link
                    )
            ] as ExternalLink[]
        ));
    }

    const handleRemoveLink = (linkIndex: number): void => {
        setExternalLinks([...externalLinks.filter((extLink: ExternalLink) =>
                externalLinks.indexOf(extLink) !== linkIndex)]);
    }

    const handleAddLink = (externalLinks: ExternalLink[]): void => {
        if (externalLinks.some((l: ExternalLink) => !l.url)) {
            const emptyLinks: ExternalLink[] = externalLinks.filter((l: ExternalLink) => !l.url);

            dispatch(setErrorMsg(`You must fill ${emptyLinks.length > 1
                ? emptyLinks.map((l: ExternalLink) => l.name).join(", ")
                : emptyLinks[0].name} before adding a new one`
            ));

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
                } as ExternalLink
            ]
        );
    }

    const handleLabelChange = (tag: Tag): void => {
        setSelectedTags([...selectedTags, tag.tag]);
    }

    const handleStageChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>): void => {
        const stage = currentProject?.stages.find(s => s.stageId === ev.target.value);

        if (stage) {
            const selectedStage: SelectedStage = {
                stageId: stage.stageId,
                title: stage.title,
            };

            setSelectedStage(selectedStage);
        }
    }, [currentProject]);

    const removeDuplicates = (links: ExternalLink[]) => {
        setExternalLinks(renameLinks(getUniqueLinks(links)));
        dispatch(setErrorMsg(null));
    }

    const handleSearchAssignees = useCallback((query: string) => {
        query = query.trim().toLowerCase();

        const newSearchResults = currentProject?.team.filter(u =>
            (u.firstName.toLowerCase().includes(query)) ||
            (u.lastName.toLowerCase().includes(query))
        );

        if (!!newSearchResults?.length) {
            setAssigneesSearchResults(newSearchResults as IUser[]);
        } else setAssigneesSearchResults([]); 
    }, [currentProject?.team])

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
        
        const newSubtask: NewSubTask = createNewSubtask(subtasks.length);

        setSubtasks([...subtasks, newSubtask]);
    }

    const handleSubtaskIsDone = (subtaskId: string) => {
        setSubtasks([
            ...subtasks.map(s => s.subtaskId === subtaskId
                ? {
                    ...s,
                    isDone: !s.isDone
                } as NewSubTask
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
                    } as NewSubTask
                    : s
            )
        ]);
    }

    const handleRemoveSubtask = (subtaskId: string) => {
        setSubtasks([
            ...subtasks.filter(s => s.subtaskId !== subtaskId)
        ]);
    }

    const handleSubtaskOnBlur = (subtask: NewSubTask) => {
        if (!subtask.title) {
            handleRemoveSubtask(subtask.subtaskId);
        }
    }

    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            subtasks
        }) as ITask);
    }, [subtasks])

    useEffect(() => {
        if (assigneesSearchQuery) {
            handleSearchAssignees(assigneesSearchQuery);
        } else {
            resetAssigneesSearch();
        }
    }, [assigneesSearchQuery, handleSearchAssignees])

    // Update selected stage in inputValues
    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            currentStage: selectedStage
        }) as ITask);
    }, [selectedStage])

    useEffect(() => {
        if (isEditTaskModalOpen && task) {
            setSelectedStage(task.currentStage as SelectedStage);

            const getAssignees = (assigneesIds: string[]): TeamMember[] => {
                return currentProject?.team.filter(u =>
                    assigneesIds.some(id => u.userId === id))
                    || [];
            }

            setSelectedAssignees(getAssignees(task.assignees));
            setSubtasks(task.subtasks);
        }
    }, [task, isEditTaskModalOpen, currentProject?.team])

    // Add links to inputValues
    useEffect(() => {
        if (externalLinks?.length) {
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
            } as ITask));
        }
    }, [externalLinks])

    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            tags: selectedTags
        }) as ITask);
    }, [selectedTags])

    const router = useRouter();
    useEffect(() => {
        if (!currentProject) router.push(LINKS.PROJECTS);
    }, [currentProject, router])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
        setSelectedPriority(currentTask?.priority as Priority);
        setExternalLinks(currentTask?.externalLinks as ExternalLink[]);
        setSelectedTags(currentTask?.tags as TagName[]);
    }, [currentTask, DEFAULT_VALUES])

    useEffect(()=> {
        setInputValues(inputValues => ({
            ...inputValues,
            priority: selectedPriority as string
        }) as ITask);
    }, [selectedPriority])

    useEffect(()=> {
        setInputValues(inputValues => ({
            ...inputValues,
            assignees: assigneesIds as string[]
        }) as ITask);
    }, [assigneesIds])

  return (
    <>
        {duplicatedLinks
            ? <ErrorModal
                withSubmitBtn
                submitBtnText="Remove duplicates and continue"
                onSubmit={() => removeDuplicates(inputValues?.externalLinks as ExternalLink[])}
                action={() => dispatch(setErrorMsg(null))}
            />
            : <ErrorModal action={() => dispatch(setErrorMsg(null))} />
        }
        
        {inputValues && (
            <Modal
                title={`Edit ${currentTask?.title}`}
                onSubmit={(ev: FormEvent<HTMLFormElement>) => handleSave(ev, inputValues)}
                onClose={closeModal}
                submitBtnText="Save"
                isOpen={isEditTaskModalOpen}
            >
                <div className="flex flex-col w-full overflow-y-auto max-h-[70vh] my-auto">
                    <Input
                        labelText="Title"
                        type="text"
                        name="title"
                        id="title"
                        value={inputValues.title}
                        onChange={handleInputChange}
                        additionalStyles="focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4"
                        isRequired
                    />

                    <Line additionalStyles='mb-4' />
                    
                    <Input
                        labelText="Due date"
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={convertToISODate(inputValues.dueDate as string) as string}
                        onChange={handleInputChange}
                        additionalStyles="focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4"
                    />

                    <Line additionalStyles='mb-4' />

                    <InputLabel isTitle text="Stage" isRequired />

                    <div className="flex items-center w-full gap-1">
                        {currentProject?.stages
                            .map((s: IStage, idx: number) => (
                                <Fragment key={s.stageId}>
                                    <input
                                        hidden
                                        type="radio"
                                        name="stages"
                                        value={s.stageId}
                                        id={s.stageId}
                                        onChange={handleStageChange}
                                    />

                                    <InputLabel
                                        htmlFor={s.stageId}
                                        text={s.title}
                                        additionalStyles={twMerge(`
                                            w-full
                                            px-3
                                            py-1
                                            bg-white
                                            text-center
                                            text-white
                                            bg-slate-300
                                            border
                                            border-slate-500
                                            cursor-pointer
                                            ${s.stageId === selectedStage?.stageId && "bg-blue-400"}
                                            ${(idx === 0) && "rounded-bl-lg"}
                                        `)}
                                    />
                                </Fragment>
                            )
                        )}
                    </div>

                    <Line additionalStyles='mb-4' />

                    <div className="flex gap-1 items-center w-full py-4 flex-wrap">
                        <InputLabel isTitle text="Priority" isRequired />

                        <div className="w-full flex items-center gap-1">
                            {PRIORITIES.map((priority: Priority) => {
                                return (
                                    <div key={priority} className="w-full flex items-center justify-center">
                                        <input
                                            hidden
                                            type="radio"
                                            name="priority"
                                            key={priority}
                                            id={priority}
                                            value={priority}
                                            onChange={handleSelectedPriorityChange}
                                        />

                                        <InputLabel
                                            htmlFor={priority}
                                            text={capitalizeFirstLetter(priority)}
                                            title={capitalizeFirstLetter(priority)}
                                            additionalStyles={twMerge(`
                                                ${priority === selectedPriority
                                                    ? isSelected(priority)
                                                    : "bg-slate-300"
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
                                            `)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Line additionalStyles='mb-4' />

                    <div
                        className="flex items-center w-full mt-2 mb-3 flex-wrap"
                    >
                        <InputLabel isTitle text="Tags" />

                        <div className="flex flex-wrap w-fit items-center gap-2 mr-2">
                            {TAGS.map((t: Tag, idx: number) => {
                                const {tag} = t;
                                return (
                                    <div key={idx} className="relative inline-flex overflow-visible">
                                        <input
                                            hidden
                                            type="checkbox"
                                            name="tags"
                                            id={tag}
                                            value={tag}
                                            onClick={() => handleLabelChange(t)}
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
                                                rounded-bl-lg
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
                                                ${selectedTags?.some(t => t === tag) && "opacity-100"}
                                            `)}
                                        />
                                        <AnimatePresence>
                                            {selectedTags?.some((t: TagName) => t === tag) && (
                                                <motion.div
                                                    initial={{
                                                        scale: 0,
                                                        opacity: 0,
                                                        position: "absolute",
                                                        right: -1.5,
                                                        top: -1.5,
                                                        zIndex: 20,
                                                        marginBlock: "auto"
                                                    }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                        transition: {
                                                            duration: 0.08
                                                        }
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0,
                                                        transition: {
                                                            duration: 0.1
                                                        }
                                                    }}
                                                >
                                                    <ButtonWithIcon
                                                        icon={<RxCross2 />}
                                                        title="Remove"
                                                        action={() => setSelectedTags(selectedTags?.filter(
                                                            (t: TagName) => t !== tag
                                                        ))}
                                                        additionalStyles={`
                                                            rounded-full
                                                            w-4
                                                            aspect-square
                                                            text-xs
                                                            flex
                                                            items-center
                                                            justify-center
                                                            shadow-md
                                                            shadow-gray-400
                                                            absolute
                                                            -top-1.5
                                                            -right-1.5
                                                            p-0
                                                            bg-white
                                                        `}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Line additionalStyles='mb-4' />

                    <InputLabel
                        htmlFor="description"
                        text="Description"
                        additionalStyles="text-xl block w-full"
                    />
                    <textarea
                        value={inputValues.description}
                        name="description"
                        id="description" 
                        onChange={handleInputChange}
                        className="text-lg px-1 outline-none mb-4 border rounded-bl-lg border-stone-300 w-full min-h-20 max-h-40"
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
                                        isChecked={sub.isDone}
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
                            additionalStyles=""
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
                            <div className="absolute top-[65px] shadow-md z-10 w-full flex flex-col gap-2 border border-slate-200 bg-white">
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
                                                    additionalStyles="w-7 h-7"
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
                                            key={assignee.userId}
                                            assignee={assignee}
                                            withImg
                                            isSelectable
                                            isSelected={assigneesIds.some(id => id === assignee.userId)}
                                            onRemove={() => handleRemoveAssignee(assignee.userId)}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    
                    <Line additionalStyles='mb-4' />

                    <div className="flex flex-col items-start gap-4 mb-4 w-full">
                        <InputLabel
                            isTitle
                            isOptional
                            text="Links"
                        />

                        {externalLinks?.map((l: ExternalLink, index: number) => (
                                <div key={index} className="flex items-center pl-4 gap-1 w-full relative">
                                    <Input
                                        key={index}
                                        id={l.name}
                                        type="text"
                                        name="externalLinks"
                                        onChange={(ev) => handleLinksChange(ev, index)}
                                        labelText={`Link #${index + 1}`}
                                        placeholder="Add a link..."
                                        value={l.url}
                                        additionalStyles="grow flex-1 pl-1.5 rounded-bl-lg"
                                        labelAdditionalStyles="mr-3 text-md font-thin"
                                        withIconInsideInput
                                        inputIcon={!!l.url && (
                                            <ButtonWithIcon
                                                icon={<RxCross2 />}
                                                withTooltip={false}
                                                action={() => setExternalLinks(externalLinks =>
                                                    [...externalLinks.map(l => {
                                                        return externalLinks.indexOf(l) === index
                                                            ?   {
                                                                    ...l,
                                                                    url: ""
                                                                }
                                                            : l;
                                                    })]
                                                )}
                                                additionalStyles="border-none h-full"
                                            />
                                        )}
                                    />

                                    {externalLinks.length > 1 && (
                                        <ButtonWithIcon
                                            icon={<BiTrash />}
                                            action={() => handleRemoveLink(index)}
                                            title="Remove link"
                                            withTooltip
                                            additionalStyles="sm:hover-text-red-500 active:text-red-500 sm:hover:border-red-500 active:border-red-500 bg-white"
                                        />
                                    )}
                                </div>
                            )
                        )}

                        <Button
                            type="button"
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
                                font-normal
                            `}
                            action={() => handleAddLink(externalLinks)}
                        >
                            <span className="pt-1">Add link</span>
                            <span className="text-sm"><BiPlus /></span>
                        </Button>
                    </div>

                    <Line additionalStyles='mb-4' />

                    <div className="flex w-full items-center justify-between">
                        <InputLabel
                            isOptional
                            isTitle
                            text="Thumbnail"
                        />
                        
                        {inputValues.thumbnailSrc
                            ?   <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        id="thumbnailSrc"
                                        labelText="Change"
                                        name="thumbnailSrc"
                                        onChange={handleUploadChange}
                                        additionalStyles="hidden"
                                        labelAdditionalStyles="cursor-pointer text-blue-400 sm:hover:text-blue-500 active:text-blue-500"
                                    />

                                    <Button
                                        type="button"
                                        action={handleRemoveThumbnail}
                                        additionalStyles={`
                                            text-xl
                                            cursor-pointer
                                            text-blue-400
                                            sm:hover:text-blue-500
                                            active:text-blue-500
                                            border-none
                                            w-fit
                                            font-normal
                                        `}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            :   <Input
                                    type="file"
                                    id="thumbnailSrc"
                                    labelText="Upload from my device"
                                    name="thumbnailSrc"
                                    onChange={handleUploadChange}
                                    additionalStyles="hidden"
                                    labelAdditionalStyles="cursor-pointer text-blue-400 sm:hover:text-blue-500 active:text-blue-500"
                                />
                        }
                    </div>

                    {inputValues.thumbnailSrc && (
                        <Image
                            src={inputValues.thumbnailSrc as string}
                            width={100}
                            height={60}
                            alt="Thumbnail"
                            className="w-full rounded-bl-lg border border-black mb-5"
                        />
                    )}
                </div>
            </Modal>
        )}
    </>
  )
}

export default EditTaskModal;