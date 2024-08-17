import { RootState } from "../store";

export const selectIsMobileMenuOpen = (state: RootState) => state.modals.mobileMenu;

export const selectIsBackLayerOpen = (state: RootState) => state.modals.backLayer;

export const selectIsImageModalOpen = (state: RootState) => state.modals.image;

export const selectIsErrorModalOpen = (state: RootState) => state.modals.error;

export const selectIsInvitationModalOpen = (state: RootState) => state.modals.invitation;

export const selectIsActivityLogOpen = (state: RootState) => state.modals.activityLog;

export const selectIsDeleteProjectModalOpen = (state: RootState) => state.modals.deleteProject;
export const selectIsDeleteStageModalOpen = (state: RootState) => state.modals.deleteStage;
export const selectIsDeleteTaskModalOpen = (state: RootState) => state.modals.deleteTask;

export const selectIsEditProjectModalOpen = (state: RootState) => state.modals.editProject;
export const selectIsEditStageModalOpen = (state: RootState) => state.modals.editStage;
export const selectIsEditTaskModalOpen = (state: RootState) => state.modals.editTask;

export const selectIsNewProjectModalOpen = (state: RootState) => state.modals.newProject;
export const selectIsNewStageModalOpen = (state: RootState) => state.modals.newStage;
export const selectIsNewTaskModalOpen = (state: RootState) => state.modals.newTask;