"use client"

import { useAppDispatch } from "@/hooks/hooks";
import useProjects from "@/hooks/useProjects";
import { closeEditTaskModal, setError } from "@/store/app/app.slice";
import { IProject, IStage, ITask, Priority, setCurrentProject } from "@/store/projects/projects.slice";
import { LINKS } from "@/utils/links";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import Input from "../common/Input";
import useModals from "@/hooks/useModals";
import { capitalizeFirstLetter, convertToISODate } from "@/utils/utils";
import { DEFAULT_EXTERNAL_LINK, DEFAULT_PRIORITY, LABELS, MAX_EXTERNAL_LINKS, PRIORITIES } from "@/utils/constants";
import Label from "../common/Label";
import ButtonWithIcon from "../common/ButtonWithIcon";
import { BiPlus, BiTrash } from "react-icons/bi";
import { IExternalLink } from "@/utils/interfaces";
import { URL_REGEX } from "@/utils/regexp";
import { RxCross2 } from "react-icons/rx";
import { TLabel } from "@/utils/types";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";
import ErrorModal from "./ErrorModal";
import { AnimatePresence, motion } from "framer-motion";

const EditTaskModal = (task: ITask) => {
    const dispatch = useAppDispatch();

    const [selectedPriority, setSelectedPriority] = useState<Priority>(DEFAULT_PRIORITY);
    const [selectedLabels, setSelectedLabels] = useState<TLabel[]>([]);

    const {currentProject, currentTask} = useProjects();
    const {editTaskModalOpen} = useModals();

    const DEFAULT_VALUES: ITask = task;

    const [inputValues, setInputValues] = useState<ITask | null>(null);

    const [externalLinks, setExternalLinks] = useState<IExternalLink[]>([DEFAULT_EXTERNAL_LINK]);

    const [linksError, setLinksError] = useState<string | null>(null);

    const handleUploadChange = (e: any) => {
        if (!e.target.files.length) return;
        handleUpload(e.target.files[0]);
    }

    const handleUpload = (file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64EncodedFile = reader.result as string;
          setInputValues({...inputValues, imgSrc: base64EncodedFile} as ITask);
        }
      }

    const closeModal = () => {
        dispatch(closeEditTaskModal());
        setInputValues(DEFAULT_VALUES);
    }

    const handleSave = (ev: FormEvent<HTMLFormElement>, updatedValues: ITask, externalLinks: IExternalLink[]): void => {
        ev.preventDefault();

        if (linksError) {
            dispatch(setError(linksError));
            return;
        }

        const links: IExternalLink[] = externalLinks
            .filter((link: IExternalLink) => link.url)
            .map((l: IExternalLink) => (
                {
                    ...l,
                    url: l.url.trim()
                }
            ));

        if (links[0]?.url && !areValid(links)) {
            const invalidLinks: IExternalLink[] = getInvalidLinks(links);
            
            setLinksError(`${invalidLinks.map((l: IExternalLink) => l.name)
                .join(", ")} ${invalidLinks.length > 1
                    ? "are not valid links"
                    : "is not a valid link"
                }`
            );

            return;
        }
        
        const updatedTask: ITask = {
            ...task,
            ...updatedValues,
            externalLinks: links
        } as ITask;

        console.log(updatedTask);
        
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

        const updatedCurrentProject: IProject = {
            ...currentProject,
            stages: updatedStages
        } as IProject;

        dispatch(setCurrentProject(updatedCurrentProject));

        closeModal();
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const updatedValues = {...inputValues, [ev.target.name]: ev.target.value};
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

    const handleRemoveThumbnail = ()=> {
        setInputValues({...inputValues, imgSrc: ""} as ITask);
    }
    
    const areValid = (links: IExternalLink[]): boolean => {
            return links.some((l: IExternalLink) => URL_REGEX.test(l.url));
    }

    const getInvalidLinks = (links: IExternalLink[]): IExternalLink[] => {
        return links.filter((l: IExternalLink) => !URL_REGEX.test(l.url));
    }

    const handleLinksChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>, index: number = 0): void => {
        setExternalLinks(
            [
                ...externalLinks.map((link: IExternalLink, i: number) =>
                    i === index
                        ?   {
                                ...link,
                                url: value
                            }
                        : link
                    )
            ] as IExternalLink[]);
    }

    const handleRemoveLink = (linkIndex: number): void => {
        setExternalLinks([...externalLinks.filter((extLink: IExternalLink) =>
                externalLinks.indexOf(extLink) !== linkIndex)]);
    }

    const handleAddLink = (externalLinks: IExternalLink[]): void => {
        console.log("Checking")
        if (externalLinks.some((l: IExternalLink) => !l.url)) {
            const emptyLinks: IExternalLink[] = externalLinks.filter((l: IExternalLink) => !l.url);

            setLinksError(`You must fill ${emptyLinks.length > 1
                ? emptyLinks.map((l: IExternalLink) => l.name).join(", ")
                : emptyLinks[0].name} before adding a new one`
            );

            return;
        }

        if (externalLinks.length === MAX_EXTERNAL_LINKS) {
            setLinksError(`Cannot add more than ${MAX_EXTERNAL_LINKS} links`);
            return;
        }
        
        setExternalLinks(
            [
                ...externalLinks,
                {
                    name: `Link #${externalLinks.length + 1}`,
                    url: ""
                } as IExternalLink
            ]
        );
    }

    const handleLabelChange = (label: TLabel) => {
        setSelectedLabels([...selectedLabels, label]);
    }

    useEffect(() => {
        setInputValues(inputValues => ({
            ...inputValues,
            labels: selectedLabels
        }) as ITask);
    }, [selectedLabels])

    useEffect(() => {
        if (!currentProject) redirect(LINKS["PROJECTS"]);
    }, [currentProject])

    useEffect(() => {
        setInputValues(DEFAULT_VALUES);
        setSelectedPriority(currentTask?.priority as Priority);
        setExternalLinks(currentTask?.externalLinks as IExternalLink[]);
        setSelectedLabels(currentTask?.labels as TLabel[]);
    }, [currentTask])

    useEffect(()=> {
        setInputValues({...inputValues, priority: selectedPriority as string} as ITask);
    }, [selectedPriority])

    // SetError with linksError
    useEffect(() => {
        if (linksError) dispatch(setError(linksError));
    }, [linksError])

    // Clear linksError when externalLinks change
    useEffect(() => {
        if (linksError) setLinksError(null);
    }, [externalLinks])

  return (
    <>
        <ErrorModal action={() => setLinksError(null)} />
        
        {inputValues && (
            <Modal
                title={`Edit ${currentTask?.title}`}
                onSubmit={(ev: FormEvent<HTMLFormElement>) => handleSave(ev, inputValues, externalLinks)}
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
                    />
                    <Input
                        labelText="Due date"
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={convertToISODate(inputValues.dueDate as string)}
                        onChange={handleInputChange}
                        additionalStyles="focus:text-stone-900 focus:border-stone-900 text-stone-500 mb-4"
                    />

                    <div className="flex gap-1 items-center w-full py-4">
                        <p className="text-xl block w-1/4 text-stone-800 cursor-default">Priority</p>

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

                                        <Label
                                            htmlFor={priority}
                                            labelText={capitalizeFirstLetter(priority)}
                                            title={capitalizeFirstLetter(priority)}
                                            additionalStyles={`
                                                ${priority === selectedPriority ? isSelected(priority) : "bg-slate-300"}
                                                ${setPriorityColor(priority)}
                                                w-full
                                                border
                                                border-stone-500
                                                py-1
                                                px-2
                                                text-white
                                                text-lg
                                                drop-shadow-md
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

                    <div
                        className="flex items-center w-full mt-2 mb-3 justify-between"
                    >
                        <Label htmlFor="labels" labelText="Labels" additionalStyles="text-xl block w-1/4"/>

                        <div className="flex flex-wrap w-fit items-center gap-2 mr-2">
                            {LABELS.map((label: TLabel, idx: number) => (
                                <div key={idx} className="relative inline-flex overflow-visible">
                                    <input
                                        hidden
                                        type="radio"
                                        name="taskLabels"
                                        id={label}
                                        value={label}
                                        onClick={() => handleLabelChange(label)}
                                    />
                                    <Label
                                        htmlFor={label}
                                        labelText={label.toUpperCase()}
                                        additionalStyles={twMerge(`
                                            opacity-70
                                            sm:hover:opacity-100
                                            active:opacity-100
                                            min-w-[100px]
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
                                            ${label === "bug" && "bg-orange-400 border-orange-600"}
                                            ${label === "completed" && "bg-green-500 border-green-600"}
                                            ${selectedLabels?.some(l => l === label) && "opacity-100"}
                                        `)}
                                    />
                                    <AnimatePresence>
                                        {selectedLabels?.some((l: TLabel) => l === label) && (
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
                                                    icon={<RxCross2/>}
                                                    title="Remove"
                                                    action={() => setSelectedLabels(selectedLabels?.filter(
                                                        (l: TLabel) => l !== label
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
                            ))}
                        </div>
                    </div>

                    <Label
                        htmlFor="description"
                        labelText="Description"
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
                        <Label labelText="Links" htmlFor="links" isOptional={true}/>

                        {externalLinks?.length === 1
                            ? (
                                <div className="flex items-center pl-4 gap-1 w-full">
                                    <Input
                                        id="externalLinks"
                                        type="text"
                                        name="externalLinks"
                                        onChange={handleLinksChange}
                                        labelText={`Link #${externalLinks?.length}`}
                                        placeholder="Add a link..."
                                        value={externalLinks[0]?.url}
                                        additionalStyles="grow"
                                        labelAdditionalStyles="mr-3 text-sm font-thin"
                                    />
                                </div>
                            ) : externalLinks?.map((l: IExternalLink, index: number) => (
                                    <div key={index} className="flex items-center pl-4 gap-1 w-full">
                                        <Input
                                            key={index}
                                            id="externalLinks"
                                            type="text"
                                            name="externalLinks"
                                            onChange={(ev) => handleLinksChange(ev, index)}
                                            labelText={`Link #${index + 1}`}
                                            placeholder="Add a link..."
                                            value={l.url}
                                            additionalStyles="grow"
                                            labelAdditionalStyles="mr-3 text-sm font-thin"
                                        />

                                        <ButtonWithIcon
                                            icon={<BiTrash/>}
                                            action={() => handleRemoveLink(index)}
                                            title="Remove link"
                                            additionalStyles="sm:hover-text-red-500 active:text-red-500 sm:hover:border-red-500 active:border-red-500"
                                        />
                                    </div>
                                )
                            )}

                        <button
                            type="button"
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
                            onClick={() => handleAddLink(externalLinks)}
                        >
                            <span className="pt-1">Add link</span>
                            <span className="text-sm"><BiPlus/></span>
                        </button>
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <p className="text-xl text-stone-800 cursor-default">Thumbnail</p>
                        
                        {inputValues.imgSrc
                            ?   <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        id="imgSrc"
                                        labelText="Change"
                                        name="imgSrc"
                                        onChange={handleUploadChange}
                                        additionalStyles="hidden"
                                        labelAdditionalStyles="cursor-pointer text-blue-500 sm:hover:text-blue-400 active:text-blue-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveThumbnail}
                                        className="text-xl cursor-pointer text-blue-500 sm:hover:text-blue-400 active:text-blue-400"
                                    >
                                        Remove
                                    </button>
                                </div>
                            :   <Input
                                    type="file"
                                    id="imgSrc"
                                    labelText="Upload from my device"
                                    name="imgSrc"
                                    onChange={handleUploadChange}
                                    additionalStyles="hidden"
                                    labelAdditionalStyles="cursor-pointer text-blue-400 sm:hover:text-blue-500 active:text-blue-500"
                                />
                        }
                    </div>

                    {inputValues.imgSrc &&
                        <Image
                            src={inputValues.imgSrc as string}
                            width={100}
                            height={60}
                            alt="Thumbnail"
                            className="w-full rounded-bl-lg border border-black"
                        />
                    }
                </div>
            </Modal>
        )}
    </>
  )
}

export default EditTaskModal;