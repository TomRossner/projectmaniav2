import { selectIsMobileMenuOpen } from '@/store/modals/modals.selectors';
import { useAppDispatch, useAppSelector } from './hooks';
import { closeModal, openModal } from '@/store/modals/modals.slice';

const useMobileMenu = () => {
    const isMobileMenuOpen = useAppSelector(selectIsMobileMenuOpen);
    const dispatch = useAppDispatch();

    const openMobileMenu = () => dispatch(openModal('mobileMenu'));
    const closeMobileMenu = () => dispatch(closeModal('mobileMenu'));

  return {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  }
}

export default useMobileMenu;