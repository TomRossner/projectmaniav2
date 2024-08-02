import { closeModal, openModal } from '@/store/modals/modals.slice';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectErrorMsg } from '@/store/error/error.selectors';
import { setErrorMsg } from '@/store/error/error.slice';

const useError = () => {
    const errorMsg = useAppSelector(selectErrorMsg);

    const dispatch = useAppDispatch();

    const openErrorModal = () => dispatch(openModal('error'));
    const closeErrorModal = () => dispatch(closeModal('error'));

    const clearError = () => dispatch(setErrorMsg(null));

  return {
    errorMsg,
    openErrorModal,
    closeErrorModal,
    clearError,
  }
}

export default useError;