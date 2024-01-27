import { useAppSelector } from './hooks';
import { selectMobileMenu } from '@/store/app/app.selectors';

const useMobileMenu = () => {
    const mobileMenu = useAppSelector(selectMobileMenu);

  return {
    mobileMenu
  }
}

export default useMobileMenu;