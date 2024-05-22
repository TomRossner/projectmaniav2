import { IStage } from "@/store/projects/projects.slice";
import { ScrollDirection, Priority, TOption } from "./types";
import { ExternalLink } from "./types";
import { URL_REGEX } from "./regexp";

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
}