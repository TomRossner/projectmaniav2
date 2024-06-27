import {
  selectEditProjectModalOpen,
  selectEditStageModal,
  selectEditTaskModalOpen,
  selectErrorModal,
  selectInvitationModalOpen,
  selectNewProjectModal,
  selectNewStageModal,
  selectNewTaskModal
} from "@/store/app/app.selectors";
import { useAppSelector } from "./hooks";

const useModals = () => {
    const editStageModalOpen = useAppSelector(selectEditStageModal);
    const errorModalOpen = useAppSelector(selectErrorModal);

    const newStageModalOpen = useAppSelector(selectNewStageModal);
    const newTaskModalOpen = useAppSelector(selectNewTaskModal);
    const newProjectModalOpen = useAppSelector(selectNewProjectModal);

    const editTaskModalOpen = useAppSelector(selectEditTaskModalOpen);
    const editProjectModalOpen = useAppSelector(selectEditProjectModalOpen);

    const invitationModalOpen = useAppSelector(selectInvitationModalOpen);

  return {
    editStageModalOpen,
    errorModalOpen,
    newStageModalOpen,
    newTaskModalOpen,
    newProjectModalOpen,
    editTaskModalOpen,
    editProjectModalOpen,
    invitationModalOpen,
  }
}

export default useModals;