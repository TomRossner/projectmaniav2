import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalsState {
    mobileMenu: boolean;

    error: boolean;

    invitation: boolean;
    
    backLayer: boolean;

    activityLog: boolean;
    
    deleteProject: boolean;
    deleteStage: boolean;
    deleteTask: boolean;
    
    editProject: boolean;
    editStage: boolean;
    editTask: boolean;
    
    newProject: boolean;
    newStage: boolean;
    newTask: boolean;
}

const initialState: ModalsState = {
    mobileMenu: false,
    
    error: false,

    invitation: false,
    
    backLayer: false,

    activityLog: false,
    
    deleteProject: false,
    deleteStage: false,
    deleteTask: false,
    
    editProject: false,
    editStage: false,
    editTask: false,
    
    newProject: false,
    newStage: false,
    newTask: false,
}

export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
      openModal: (state, action: PayloadAction<keyof ModalsState>) => {
        state[action.payload] = true;
      },
      closeModal: (state, action: PayloadAction<keyof ModalsState>) => {
        state[action.payload] = false;
      },
    },
});

export const {
    openModal,
    closeModal
} = modalsSlice.actions;