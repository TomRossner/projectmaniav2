import { ITask } from '@/store/projects/projects.slice';
import { useAppSelector } from './hooks';
import { selectFilters } from '@/store/projects/projects.selectors';
import { Filter, Status } from '@/utils/types';
import { getStatus } from '@/utils/utils';

const useFilters = () => {
    const filters = useAppSelector(selectFilters);

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
    
    const getFilteredTasks = (tasks: ITask[], appliedFilters: Filter[]): ITask[] => {
        if (!appliedFilters.length) return tasks;
        
        const filters = getFilters(["priority", "tag", "status", "date"], appliedFilters);
    
        let filteredTasks: ITask[] = tasks as ITask[];
    
        for (const filter of filters) {
            const category = filter.category.toLowerCase();
    
            switch (category) {
                case "priority":
                    filteredTasks = filteredTasks.filter(t => t.priority === filter.value.toLowerCase()) as ITask[];
                    break;
                case "tag":
                    filteredTasks = filteredTasks.filter(t => t.tags.some(t => t.toLowerCase() === filter.value.toLowerCase())) as ITask[];
                    break;
                case "status":
                    filteredTasks = filteredTasks.filter(t => t.isDone === getStatus(t.isDone, filter.value as Status)) as ITask[];
                    break;
                
                default:
                    filteredTasks = filteredTasks;
                    break;
            }
        }
    
        return filteredTasks;
    }

    return {
        filters,
        getFilters,
        getFilteredTasks
   }
}

export default useFilters;