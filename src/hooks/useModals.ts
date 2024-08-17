import { closeModal, openModal } from "@/store/modals/modals.slice";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  selectIsActivityLogOpen,
  selectIsBackLayerOpen,
  selectIsDeleteProjectModalOpen,
  selectIsDeleteStageModalOpen,
  selectIsDeleteTaskModalOpen,
  selectIsEditProjectModalOpen,
  selectIsEditStageModalOpen,
  selectIsEditTaskModalOpen,
  selectIsErrorModalOpen,
  selectIsImageModalOpen,
  selectIsInvitationModalOpen,
  selectIsNewProjectModalOpen,
  selectIsNewStageModalOpen,
  selectIsNewTaskModalOpen
} from "@/store/modals/modals.selectors";

const useModals = () => {
    const isBackLayerOpen = useAppSelector(selectIsBackLayerOpen);

    const isErrorModalOpen = useAppSelector(selectIsErrorModalOpen);
    
    const isInvitationModalOpen = useAppSelector(selectIsInvitationModalOpen);

    const isActivityLogOpen = useAppSelector(selectIsActivityLogOpen);
    
    const isImageModalOpen = useAppSelector(selectIsImageModalOpen);

    const isDeleteProjectModalOpen = useAppSelector(selectIsDeleteProjectModalOpen);
    const isDeleteStageModalOpen = useAppSelector(selectIsDeleteStageModalOpen);
    const isDeleteTaskModalOpen = useAppSelector(selectIsDeleteTaskModalOpen);
    
    const isEditProjectModalOpen = useAppSelector(selectIsEditProjectModalOpen);
    const isEditStageModalOpen = useAppSelector(selectIsEditStageModalOpen);
    const isEditTaskModalOpen = useAppSelector(selectIsEditTaskModalOpen);
    
    const isNewProjectModalOpen = useAppSelector(selectIsNewProjectModalOpen);
    const isNewStageModalOpen = useAppSelector(selectIsNewStageModalOpen);
    const isNewTaskModalOpen = useAppSelector(selectIsNewTaskModalOpen);

    const dispatch = useAppDispatch();

    // Open

    const openBackLayer = () => dispatch(openModal('backLayer'));

    const openImageModal = () => dispatch(openModal('image'));

    const openInvitationModal = () => dispatch(openModal('invitation'));

    const openActivityLog = () => dispatch(openModal('activityLog'));
    
    const openDeleteProjectModal = () => dispatch(openModal('deleteProject'));
    const openDeleteStageModal = () => dispatch(openModal('deleteStage'));
    const openDeleteTaskModal = () => dispatch(openModal('deleteTask'));

    const openEditProjectModal = () => dispatch(openModal('editProject'));
    const openEditStageModal = () => dispatch(openModal('editStage'));
    const openEditTaskModal = () => dispatch(openModal('editTask'));
    
    const openNewProjectModal = () => dispatch(openModal('newProject'));
    const openNewStageModal = () => dispatch(openModal('newStage'));
    const openNewTaskModal = () => dispatch(openModal('newTask'));

    // Close
    
    const closeBackLayer = () => dispatch(closeModal('backLayer'));

    const closeInvitationModal = () => dispatch(closeModal('invitation'));

    const closeImageModal = () => dispatch(closeModal('image'));
    
    const closeActivityLog = () => dispatch(closeModal('activityLog'));
    
    const closeDeleteProjectModal = () => dispatch(closeModal('deleteProject'));
    const closeDeleteStageModal = () => dispatch(closeModal('deleteStage'));
    const closeDeleteTaskModal = () => dispatch(closeModal('deleteTask'));

    const closeEditProjectModal = () => dispatch(closeModal('editProject'));
    const closeEditStageModal = () => dispatch(closeModal('editStage'));
    const closeEditTaskModal = () => dispatch(closeModal('editTask'));
    
    const closeNewProjectModal = () => dispatch(closeModal('newProject'));
    const closeNewStageModal = () => dispatch(closeModal('newStage'));
    const closeNewTaskModal = () => dispatch(closeModal('newTask'));

  return {
    isBackLayerOpen,
    isErrorModalOpen,
    isInvitationModalOpen,
    isActivityLogOpen,
    isImageModalOpen,

    isDeleteProjectModalOpen,
    isDeleteStageModalOpen,
    isDeleteTaskModalOpen,

    isEditProjectModalOpen,
    isEditStageModalOpen,
    isEditTaskModalOpen,

    isNewProjectModalOpen,
    isNewStageModalOpen,
    isNewTaskModalOpen,

    // Open modals
    openBackLayer,

    openInvitationModal,

    openImageModal,

    openActivityLog,

    openDeleteProjectModal,
    openDeleteStageModal,
    openDeleteTaskModal,

    openEditProjectModal,
    openEditStageModal,
    openEditTaskModal,

    openNewProjectModal,
    openNewStageModal,
    openNewTaskModal,

    // Close modals
    closeBackLayer,

    closeInvitationModal,

    closeImageModal,

    closeActivityLog,
    
    closeDeleteProjectModal,
    closeDeleteStageModal,
    closeDeleteTaskModal,
    
    closeEditProjectModal,
    closeEditStageModal,
    closeEditTaskModal,
    
    closeNewProjectModal,
    closeNewStageModal,
    closeNewTaskModal,
  }
}

export default useModals;