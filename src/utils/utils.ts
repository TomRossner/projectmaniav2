import { IProject, IStage, ITask, TeamMember } from "@/store/projects/projects.slice";
import { ScrollDirection, Priority, TOption, Status, NewSubTask, ActivityType } from "./types";
import { ExternalLink } from "./types";
import { URL_REGEX } from "./regexp";
import { LINKS } from "./links";
import { IUser } from "@/store/auth/auth.slice";
import { v4 as uuid } from "uuid";
import { NewActivityData, NewInvitationData } from "./interfaces";

const capitalizeFirstLetter = (string: string): string => {
    const trimmedString = string.trim();
    
    const firstLetter = trimmedString[0];
    const rest = trimmedString.substring(1, trimmedString.length);

    return `${firstLetter.toUpperCase()}${rest}`;
}

const convertToISODate = (date: string): string | void => {
    if (!date) return;
    else return new Date(date).toISOString().substring(0, 10);
}

const scrollToIndex = (index: number, direction: ScrollDirection, container: HTMLDivElement): void => {
    const nextStageOffset = index * container.clientWidth;
    
    container.scrollTo({
      left: direction === 'next'
        ? nextStageOffset + container.clientWidth
        : nextStageOffset - container.clientWidth,
      behavior: 'smooth',
    });
}

const formatURL = (link: string): string => {
  link = link.trim();

  const http: string = 'http://';
  const https: string = 'https://';

  if (link.startsWith(http)) return link.substring(0, 4) + 's' + link.substring(4);

  if (!link.startsWith(https)) return `${https}${link}`;
  
  else return link;
}

const getTotalTasks = (stages: IStage[]): string => {
  const totalTasks = stages.reduce((total, stage) => total + stage.tasks.length, 0);

  return `${totalTasks} task${(totalTasks > 1) || (totalTasks === 0) ? 's' : ''}`;
}

const getStagesCount = (stages: IStage[]): string => {
  return stages.length
    ? `${stages.length} stage${(stages.length === 1) ? '' : 's'}`
    : `0 stages`;
}

const validateUrls = (links: ExternalLink[]): boolean => {
  const urls: string[] = links.map(l => l.url);

  const areAllValid: boolean = urls.every(url => {
      const matches = url.match(URL_REGEX);
      return matches !== null && matches.length > 0;
  });

  return areAllValid;
}

const getInvalidLinks = (links: ExternalLink[]): ExternalLink[] => {
  return links.filter((l: ExternalLink) => !l.url.match(URL_REGEX));
}

const normalizeUrl = (linkUrl: string): string => {
  /*
    Removes
      - http://
      - https://
      - www.
      - http://www.
      - https://www.
    from url

    Examples:
      - https://www.google.com => google.com
      - www.youtube.com => youtube.com
      - http://localhost:3000 => localhost:3000
  */

  return linkUrl
    .trim()
    .toLowerCase()
    .replace(/^(https?:\/\/)?(http?:\/\/)?(www\.)?(https:\/\/www\.)?(http:\/\/www\.)?/, '');

  // const isHttp = linkUrl.startsWith('http://');
  // const isHttps = linkUrl.startsWith('https://');
  // const isWww = linkUrl.startsWith('www.');

  // if (isHttp || isHttps) {
  //   linkUrl = linkUrl.split(isHttp ? 'http://' : 'https://')[1];

  //   if (isWww) {
  //     return linkUrl.split('www.')[1];
  //   }

  //   return linkUrl;
  // }

  // if (isWww) {
  //   return linkUrl.split('www.')[1];
  // }

  // return linkUrl;
}

const getUniqueLinks = (links: ExternalLink[]): ExternalLink[] => {
  const map = new Map();
  const uniqueLinks: ExternalLink[] = [];

  for (let link of links) {
    const normalizedUrl: string = normalizeUrl(link.url);

    if (!map.has(normalizedUrl)) {
      map.set(normalizedUrl, true);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks;
}

const getDuplicatedLinks = (links: ExternalLink[]): ExternalLink[] => {
  const map = new Map();
  const duplicates: ExternalLink[] = [];

  for (let link of links) {
    const normalizedUrl: string = normalizeUrl(link.url);

    if (map.has(normalizedUrl)) {
      duplicates.push(link);
    }

    map.set(normalizedUrl, true);
  }

  return duplicates;
}

const renameLinks = (links: ExternalLink[]): ExternalLink[] => {
  links = links.map((link, index) => {
      return {
          name: `Link #${index + 1}`,
          url: link.url,
      } as ExternalLink;
  });
  
  return links;
}

const setPriorityColor = (priority: Priority): string => {
  switch (priority.toLowerCase()) {
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

// const getBlurData = async (url: string): Promise<string> => {
//   try {
//     const res = await fetch(url);

//     if (!res.ok) {
//       throw new Error('Failed to fetch image');
//     }

//     const buffer = await res.arrayBuffer();
//     const {base64} = await getPlaiceholder(Buffer.from(buffer));
 
//     return base64;
//   } catch (error) {
//     console.error(error);
//     return "";
//   }
// }

const createOption = (opt: string): TOption => {
  return {
    text: opt,
    disabled: false,
  }
}

const createSearchRegExp = (query: string): RegExp => {
  return new RegExp(`(${query})`, 'gi');
}

const setProjectLink = (projectId: string): string => {
  return `${LINKS.PROJECTS}/${projectId}`;
}

const getAvatarPosition = (idx: number): string => {
  const increment = idx * 5;
  return idx > 0
    ? `-mx-[${increment}] z-[${increment}]`
    : '';
}

const getStatus = (isDone: boolean, status: Status): boolean => {
  if (!status) return isDone as boolean;

  status = status.toLowerCase() as Status;

  return status === 'completed';
}

const generateId = () => {
  return uuid();
}

const createInvitation = (sender: IUser, recipient: IUser, projectData: Pick<IProject, "projectId" | "title">): NewInvitationData => {
  return {
      projectData: {
          title: projectData.title,
          projectId: projectData.projectId
      },
      sender: {
          userId: sender.userId,
          firstName: sender.firstName,
          lastName: sender.lastName
      },
      recipient: {
          userId: recipient.userId,
          firstName: recipient.firstName,
          lastName: recipient.lastName
      },
  }
}

const createNewSubtask = (subtasksLength: number): NewSubTask => {
  return {
      title: `Subtask #${subtasksLength + 1}`,
      isDone: false,
      subtaskId: uuid(),
  }
}

export {
    capitalizeFirstLetter,
    convertToISODate,
    scrollToIndex,
    formatURL,
    getTotalTasks,
    getStagesCount,
    validateUrls,
    getInvalidLinks,
    setPriorityColor,
    createOption,
    createSearchRegExp,
    renameLinks,
    getUniqueLinks,
    getDuplicatedLinks,
    getAvatarPosition,
    setProjectLink,
    getStatus,
    generateId,
    createInvitation,
    createNewSubtask,
}