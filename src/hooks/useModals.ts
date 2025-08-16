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
  selectIsFiltersModalOpen,
  selectIsImageModalOpen,
  selectIsInvitationModalOpen,
  selectIsNewProjectModalOpen,
  selectIsNewStageModalOpen,
  selectIsNewTaskModalOpen,
  selectIsTaskModalOpen
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

    const isTaskModalOpen = useAppSelector(selectIsTaskModalOpen);

    const isFiltersModalOpen = useAppSelector(selectIsFiltersModalOpen);

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

    const openTaskModal = () => dispatch(openModal('task'));
    
    const openFiltersModal = () => dispatch(openModal('filters'));

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

    const closeTaskModal = () => dispatch(closeModal('task'));

    const closeFiltersModal = () => dispatch(closeModal('filters'));

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

    isTaskModalOpen,

    isFiltersModalOpen,

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

    openTaskModal,

    openFiltersModal,

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

    closeTaskModal,

    closeFiltersModal,
  }
}

export default useModals;