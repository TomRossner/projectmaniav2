"use client"

import { useAppDispatch } from "@/hooks/hooks";
import useProjects from "@/hooks/useProjects";
import { closeEditTaskModal, setError } from "@/store/app/app.slice";
import { IProject, IStage, ITask, setCurrentProject, setCurrentTask } from "@/store/projects/projects.slice";
import { LINKS } from "@/utils/links";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ChangeEvent, FormEvent, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Input from "../common/Input";
import useModals from "@/hooks/useModals";
import { capitalizeFirstLetter, convertToISODate, getDuplicatedLinks, getInvalidLinks, getUniqueLinks, renameLinks, validateUrls } from "@/utils/utils";
import { DEFAULT_EXTERNAL_LINK, DEFAULT_PRIORITY, MAX_EXTERNAL_LINKS, PRIORITIES, TAGS } from "@/utils/constants";
import InputLabel from "../common/InputLabel";
import ButtonWithIcon from "../common/ButtonWithIcon";
import { BiPlus, BiTrash } from "react-icons/bi";
import { ExternalLink, Priority, SelectedStage, TagName } from "@/utils/types";
import { RxCross2 } from "react-icons/rx";
import { Tag } from "@/utils/types";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";
import ErrorModal from "./ErrorModal";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../common/Button";

type EditTaskModalProps = {
    task: ITask;
}

const EditTaskModal = ({task}: EditTaskModalProps) => {
    const dispatch = useAppDispatch();

    const [selectedPriority, setSelectedPriority] = useState<Priority>(DEFAULT_PRIORITY);
    const [selectedTags, setSelectedTags] = useState<TagName[]>([]);

    const {currentProject, currentTask} = useProjects();
    const {editTaskModalOpen} = useModals();

    const DEFAULT_VALUES: ITask = task;

    const [inputValues, setInputValues] = useState<ITask | null>(null);

    const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([DEFAULT_EXTERNAL_LINK]);

    const [selectedStage, setSelectedStage] = useState<SelectedStage | null>(null);

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

    const closeModal = () => {
        setSelectedStage(null);
        setInputValues(DEFAULT_VALUES);
        dispatch(closeEditTaskModal());
    }

    const handleSave = (ev: FormEvent<HTMLFormElement>, updatedValues: ITask): void => {
        ev.preventDefault();

        if (!updatedValues) return;

        dispatch(setError(null));
        
        if (updatedValues.externalLinks && updatedValues.externalLinks.length) {
            const updatedLinks: ExternalLink[] = renameLinks(getUniqueLinks(updatedValues.externalLinks));

            updatedValues = {
                ...updatedValues,
                externalLinks: updatedLinks
            } as ITask;

            const linksValid: boolean = validateUrls(updatedLinks);
    
            if (!!updatedLinks[0]?.url && !linksValid) {
                const invalidLinks: ExternalLink[] = getInvalidLinks(updatedLinks);
    
                dispatch(setError(`${invalidLinks.map((l: ExternalLink) => l.name)
                    .join(", ")} ${invalidLinks.length > 1
                        ? "are not valid links"
                        : "is not a valid link"
                    }`
                ));
    
                return;
            }
        }
        
        const updatedStages = getUpdatedStages(updatedValues as ITask, currentProject as IProject);

        const updatedCurrentProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        // dispatch(setCurrentTask(updatedValues));
        dispatch(setCurrentProject(updatedCurrentProject));

        closeModal();
        return;
    }

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

    const handleRemoveThumbnail = (): void => {
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

            dispatch(setError(`You must fill ${emptyLinks.length > 1
                ? emptyLinks.map((l: ExternalLink) => l.name).join(", ")
                : emptyLinks[0].name} before adding a new one`
            ));

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
                } as ExternalLink
            ]
        );
    }

    const handleLabelChange = (tag: Tag): void => {
        setSelectedTags([...selectedTags, tag.tag]);
    }

    const handleStageChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        const stage = currentProject?.stages.find(s => s.stageId === ev.target.value);

        if (stage) {
            const selectedStage: SelectedStage = {
                stageId: stage.stageId,
                title: stage.title,
            };

            setSelectedStage(selectedStage);
        }
    }

    const getUpdatedStages = useCallback((inputValues: ITask, project: IProject): IStage[] | void => {
        if (!project || !inputValues) {
            dispatch(setError('Failed to update project'));
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

        dispatch(setError('Failed to update project'));
        return project.stages;
    }, [task, currentProject?.stages, selectedStage?.stageId]);

    // Update selected stage in inputValues
    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            currentStage: selectedStage
        }) as ITask);
    }, [selectedStage])

    useEffect(() => {
        if (editTaskModalOpen && task) {
            setSelectedStage(task.currentStage as SelectedStage);
        }
    }, [task, editTaskModalOpen])

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

    useEffect(() => {
        if (!currentProject) redirect(LINKS["PROJECTS"]);
    }, [currentProject])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
        setSelectedPriority(currentTask?.priority as Priority);
        setExternalLinks(currentTask?.externalLinks as ExternalLink[]);
        setSelectedTags(currentTask?.tags as TagName[]);
    }, [currentTask])

    useEffect(()=> {
        setInputValues({...inputValues, priority: selectedPriority as string} as ITask);
    }, [selectedPriority])

    const removeDuplicates = (links: ExternalLink[]) => {
        setExternalLinks(renameLinks(getUniqueLinks(links)));
        dispatch(setError(null));
    }

    const duplicatedLinks = useMemo(() => {
        if (inputValues?.externalLinks) {
            return !!getDuplicatedLinks(inputValues?.externalLinks as ExternalLink[]).length;
        } else return false;
    }, [inputValues?.externalLinks]);

  return (
    <>
        {duplicatedLinks
            ? <ErrorModal
                withSubmitBtn
                submitBtnText="Remove duplicates and continue"
                onSubmit={() => removeDuplicates(inputValues?.externalLinks as ExternalLink[])}
                action={() => dispatch(setError(null))}
            />
            : <ErrorModal action={() => dispatch(setError(null))} />
        }
        
        {inputValues && (
            <Modal
                title={`Edit ${currentTask?.title}`}
                onSubmit={(ev: FormEvent<HTMLFormElement>) => handleSave(ev, inputValues)}
                onClose={closeModal}
                submitBtnText="Save"
                isOpen={editTaskModalOpen}
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
                    <Input
                        labelText="Due date"
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={convertToISODate(inputValues.dueDate as string) as string}
                        onChange={handleInputChange}
                        additionalStyles="focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4"
                    />

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
                                        iconInsideInput
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
                            className="w-full rounded-bl-lg border border-black"
                        />
                    )}
                </div>
            </Modal>
        )}
    </>
  )
}

export default EditTaskModal;