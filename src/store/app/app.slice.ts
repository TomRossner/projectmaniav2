import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAppInitialState {
    menuOpen: boolean;
    errorModalOpen: boolean;
    editModalOpen: boolean;
    newTaskModalOpen: boolean;
    error: string | null;
    newStageModalOpen: boolean;
    deleteStagePromptOpen: boolean;
    deleteProjectPromptOpen: boolean;
    newProjectModalOpen: boolean;
}

const initialState: IAppInitialState = {
    menuOpen: false,
    errorModalOpen: false,
    editModalOpen: false,
    newTaskModalOpen: false,
    error: null,
    newStageModalOpen: false,
    deleteStagePromptOpen: false,
    deleteProjectPromptOpen: false,
    newProjectModalOpen: false,
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        toggleMobileMenu: (state) => {
            state.menuOpen = !state.menuOpen;
        },
        closeMobileMenu: (state) => {
            state.menuOpen = false;
        },
        openMobileMenu: (state) => {
            state.menuOpen = true;
        },

        toggleErrorModal: (state) => {
            state.errorModalOpen = !state.errorModalOpen;
        },
        closeErrorModal: (state) => {
            state.errorModalOpen = false;
        },
        openErrorModal: (state) => {
            state.errorModalOpen = true;
        },

        toggleEditModal: (state) => {
            state.editModalOpen = !state.editModalOpen;
        },
        closeEditModal: (state) => {
            state.editModalOpen = false;
        },
        openEditModal: (state) => {
            state.editModalOpen = true;
        },

        toggleNewTaskModal: (state) => {
            state.newTaskModalOpen = !state.newTaskModalOpen;
        },
        closeNewTaskModal: (state) => {
            state.newTaskModalOpen = false;
        },
        openNewTaskModal: (state) => {
            state.newTaskModalOpen = true;
        },

        toggleNewStageModal: (state) => {
            state.newStageModalOpen = !state.newStageModalOpen;
        },
        closeNewStageModal: (state) => {
            state.newStageModalOpen = false;
        },
        openNewStageModal: (state) => {
            state.newStageModalOpen = true;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        toggleDeleteStagePrompt: (state) => {
            state.deleteStagePromptOpen = !state.deleteStagePromptOpen;
        },
        closeDeleteStagePrompt: (state) => {
            state.deleteStagePromptOpen = false;
        },
        openDeleteStagePrompt: (state) => {
            state.deleteStagePromptOpen = true;
        },

        toggleDeleteProjectPrompt: (state) => {
            state.deleteProjectPromptOpen = !state.deleteProjectPromptOpen;
        },
        closeDeleteProjectPrompt: (state) => {
            state.deleteProjectPromptOpen = false;
        },
        openDeleteProjectPrompt: (state) => {
            state.deleteProjectPromptOpen = true;
        },

        toggleNewProjectModal: (state) => {
            state.newProjectModalOpen = !state.newProjectModalOpen;
        },
        closeNewProjectModal: (state) => {
            state.newProjectModalOpen = false;
        },
        openNewProjectModal: (state) => {
            state.newProjectModalOpen = true;
        },
    }
})

export const {
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,

    toggleErrorModal,
    closeErrorModal,
    openErrorModal,
    
    toggleEditModal,
    closeEditModal,
    openEditModal,
    
    toggleNewTaskModal,
    closeNewTaskModal,
    openNewTaskModal,
    
    toggleNewStageModal,
    closeNewStageModal,
    openNewStageModal,

    setError,

    toggleDeleteStagePrompt,
    closeDeleteStagePrompt,
    openDeleteStagePrompt,

    toggleDeleteProjectPrompt,
    closeDeleteProjectPrompt,
    openDeleteProjectPrompt,

    toggleNewProjectModal,
    closeNewProjectModal,
    openNewProjectModal,
} = appSlice.actions;