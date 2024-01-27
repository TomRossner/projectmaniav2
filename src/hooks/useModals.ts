import {
  selectEditModal,
  selectErrorModal,
  selectNewProjectModal,
  selectNewStageModal,
  selectNewTaskModal
} from "@/store/app/app.selectors";
import { useAppSelector } from "./hooks";

const useModals = () => {
    const editModalOpen = useAppSelector(selectEditModal);
    const errorModalOpen = useAppSelector(selectErrorModal);

    const newStageModalOpen = useAppSelector(selectNewStageModal);
    const newTaskModalOpen = useAppSelector(selectNewTaskModal);
    const newProjectModalOpen = useAppSelector(selectNewProjectModal);

  return {
    editModalOpen,
    errorModalOpen,
    newStageModalOpen,
    newTaskModalOpen,
    newProjectModalOpen
  }
}

export default useModals;