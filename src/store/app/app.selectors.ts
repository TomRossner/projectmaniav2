import { RootState } from "../store";

export const selectMobileMenu = (state: RootState): boolean => state.app.menuOpen;

export const selectErrorModal = (state: RootState): boolean => state.app.errorModalOpen;

export const selectEditModal = (state: RootState): boolean => state.app.editModalOpen;

export const selectNewTaskModal = (state: RootState): boolean => state.app.newTaskModalOpen;

export const selectError = (state: RootState): string | null => state.app.error;

export const selectNewStageModal = (state: RootState): boolean => state.app.newStageModalOpen;

export const selectDeleteStagePrompt = (state: RootState): boolean => state.app.deleteStagePromptOpen;

export const selectDeleteProjectPrompt = (state: RootState): boolean => state.app.deleteProjectPromptOpen;

export const selectNewProjectModal = (state: RootState): boolean => state.app.newProjectModalOpen;