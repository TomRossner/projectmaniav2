import { useAppSelector } from './hooks';
import { selectFilters } from '@/store/projects/projects.selectors';

const useFilters = () => {
    const filters = useAppSelector(selectFilters);

    return {
        filters
   }
}

export default useFilters;