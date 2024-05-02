import { IStage } from "@/store/projects/projects.slice";
import { ScrollDirection } from "./types";

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

const displayTotalTasks = (stages: IStage[]): string => {
  const totalTasks = stages.reduce((total, stage) => total + stage.tasks.length, 0);

  return `${totalTasks} task${(totalTasks > 1) || (totalTasks === 0) ? 's' : ''}`;
}

const displayStagesCount = (stages: IStage[]): string => {
  return stages.length
    ? `${stages.length} stage${(stages.length > 1) || (stages.length === 0) ? 's' : ''}`
    : `0 stages`;
}

export {
    capitalizeFirstLetter,
    convertToISODate,
    scrollToIndex,
    formatURL,
    displayTotalTasks,
    displayStagesCount,
}