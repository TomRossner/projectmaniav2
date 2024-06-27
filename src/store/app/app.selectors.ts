import { RootState } from "../store";

export const selectMobileMenu = (state: RootState): boolean => state.app.menuOpen;

export const selectErrorModal = (state: RootState): boolean => state.app.errorModalOpen;

export const selectEditStageModal = (state: RootState): boolean => state.app.editStageModalOpen;

export const selectNewTaskModal = (state: RootState): boolean => state.app.newTaskModalOpen;

export const selectError = (state: RootState): string | null => state.app.error;

export const selectNewStageModal = (state: RootState): boolean => state.app.newStageModalOpen;

export const selectDeleteStagePrompt = (state: RootState): boolean => state.app.deleteStagePromptOpen;

export const selectDeleteProjectPrompt = (state: RootState): boolean => state.app.deleteProjectPromptOpen;

export const selectNewProjectModal = (state: RootState): boolean => state.app.newProjectModalOpen;

export const selectEditTaskModalOpen = (state: RootState): boolean => state.app.editTaskModalOpen;

export const selectDeleteTaskPrompt = (state: RootState): boolean => state.app.deleteTaskPromptOpen;

export const selectEditProjectModalOpen = (state: RootState): boolean => state.app.editProjectModalOpen;

export const selectBackLayer = (state: RootState): boolean => state.app.backLayerOpen;

export const selectSortByTabOpen = (state: RootState): boolean => state.app.sortByTabOpen;

export const selectInvitationModalOpen = (state: RootState): boolean => state.app.invitationModalOpen;