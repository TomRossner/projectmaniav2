import { useAppSelector } from './hooks';
import { selectBackLayer } from '@/store/app/app.selectors';

const useBackLayer = () => {
    const isBackLayerOpen = useAppSelector(selectBackLayer);
  return {
    isBackLayerOpen
  }
}

export default useBackLayer;