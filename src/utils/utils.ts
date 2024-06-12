import { IStage } from "@/store/projects/projects.slice";
import { ScrollDirection, Priority, TOption, Filter, Status } from "./types";
import { ExternalLink } from "./types";
import { URL_REGEX } from "./regexp";
import { LINKS } from "./links";
import { IUser } from "@/store/auth/auth.slice";

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
    ? `${stages.length} stage${(stages.length > 1) || (stages.length === 0) ? 's' : ''}`
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

const getUniqueLinks = (links: ExternalLink[]): ExternalLink[] => {
  const linksIds = new Set();
  const uniqueLinks: ExternalLink[] = [];

  for (const link of links) {
      if (!linksIds.has(link.url)) {
          linksIds.add(link.url);
          uniqueLinks.push(link);
      }

  }

  return uniqueLinks;
}

const getDuplicatedLinks = (links: ExternalLink[]): ExternalLink[] => {
  const linksIds = new Set();
  const duplicates: ExternalLink[] = [];

  for (const link of links) {
      if (linksIds.has(link.url)) {
          linksIds.add(link.url);
          duplicates.push(link);
      }

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

const userInitials = (user: IUser): string => {
  const {firstName, lastName} = user;
  return `${firstName.slice(0, 1).toUpperCase()}${lastName.slice(0, 1).toUpperCase()}`;
}

const getAvatarPosition = (idx: number): string => {
  const increment = idx * 5;
  return idx > 0
    ? `absolute right-[${increment}px] z-[${increment}]`
    : '';
}

const getFilters = (queries: string[], filtersArr: Filter[]): Filter[] => {
  let filters: Filter[] = [];

  if (!filtersArr.length) return filters;

  for (const query of queries) {
      filters = [
          ...filters,
          filtersArr.find(f => f.category.toLowerCase() === query)
      ] as Filter[];
  }

  return filters.filter(Boolean);
}

const getStatus = (isDone: boolean, status: Status): boolean => {
  if (!status) return isDone as boolean;

  status = status.toLowerCase() as Status;

  return status === 'completed';
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
    // getBlurData,
    createOption,
    createSearchRegExp,
    renameLinks,
    getUniqueLinks,
    getDuplicatedLinks,
    getAvatarPosition,
    userInitials,
    setProjectLink,
    getFilters,
    getStatus,
}