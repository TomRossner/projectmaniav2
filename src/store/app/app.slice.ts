import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAppInitialState {
    menuOpen: boolean;
    errorModalOpen: boolean;
    editStageModalOpen: boolean;
    newTaskModalOpen: boolean;
    error: string | null;
    newStageModalOpen: boolean;
    deleteStagePromptOpen: boolean;
    deleteProjectPromptOpen: boolean;
    newProjectModalOpen: boolean;
    editTaskModalOpen: boolean;
    deleteTaskPromptOpen: boolean;
    editProjectModalOpen: boolean;
    backLayerOpen: boolean;
    modalOpen: boolean;
    sortByTabOpen: boolean;
}

const initialState: IAppInitialState = {
    menuOpen: false,
    errorModalOpen: false,
    editStageModalOpen: false,
    newTaskModalOpen: false,
    error: null,
    newStageModalOpen: false,
    deleteStagePromptOpen: false,
    deleteProjectPromptOpen: false,
    newProjectModalOpen: false,
    editTaskModalOpen: false,
    deleteTaskPromptOpen: false,
    editProjectModalOpen: false,
    backLayerOpen: false,
    modalOpen: false,
    sortByTabOpen: false,
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

        toggleEditStageModal: (state) => {
            state.editStageModalOpen = !state.editStageModalOpen;
        },
        closeEditStageModal: (state) => {
            state.editStageModalOpen = false;
        },
        openEditStageModal: (state) => {
            state.editStageModalOpen = true;
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

        toggleEditTaskModal: (state) => {
            state.editTaskModalOpen = !state.editTaskModalOpen;
        },
        closeEditTaskModal: (state) => {
            state.editTaskModalOpen = false;
        },
        openEditTaskModal: (state) => {
            state.editTaskModalOpen = true;
        },

        toggleDeleteTaskPrompt: (state) => {
            state.deleteTaskPromptOpen = !state.deleteTaskPromptOpen;
        },
        closeDeleteTaskPrompt: (state) => {
            state.deleteTaskPromptOpen = false;
        },
        openDeleteTaskPrompt: (state) => {
            state.deleteTaskPromptOpen = true;
        },

        toggleEditProjectModal: (state) => {
            state.editProjectModalOpen = !state.editProjectModalOpen;
        },
        closeEditProjectModal: (state) => {
            state.editProjectModalOpen = false;
        },
        openEditProjectModal: (state) => {
            state.editProjectModalOpen = true;
        },

        toggleBackLayer: (state) => {
            state.backLayerOpen = !state.backLayerOpen;
        },
        closeBackLayer: (state) => {
            state.backLayerOpen = false;
        },
        openBackLayer: (state) => {
            state.backLayerOpen = true;
        },

        toggleModal: (state) => {
            state.modalOpen = !state.modalOpen;
        },
        closeModal: (state) => {
            state.modalOpen = false;
        },
        openModal: (state) => {
            state.modalOpen = true;
        },

        toggleSortByTab: (state) => {
            state.sortByTabOpen = !state.sortByTabOpen;
        },
        closeSortByTab: (state) => {
            state.sortByTabOpen = false;
        },
        openSortByTab: (state) => {
            state.sortByTabOpen = true;
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
    
    toggleEditStageModal,
    closeEditStageModal,
    openEditStageModal,
    
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

    toggleEditTaskModal,
    closeEditTaskModal,
    openEditTaskModal,

    toggleDeleteTaskPrompt,
    closeDeleteTaskPrompt,
    openDeleteTaskPrompt,
    
    toggleEditProjectModal,
    closeEditProjectModal,
    openEditProjectModal,

    toggleBackLayer,
    closeBackLayer,
    openBackLayer,

    toggleModal,
    closeModal,
    openModal,

    toggleSortByTab,
    closeSortByTab,
    openSortByTab,
} = appSlice.actions;