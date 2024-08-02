import { configureStore, Middleware } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.reducer";
import projectsReducer from "./projects/projects.reducer";
import { notificationsReducer } from "./notifications/notifications.reducer";
import modalsReducer from "./modals/modals.reducer";
import errorReducer from "./error/error.reducer";
import activityLogReducer from "./activity_log/activity_log.reducer";

export const throwMiddleware: Middleware = () => (next) => (action: any) => {
  next(action);
  if (action?.error) {
    throw action.error;
  }
}

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      projects: projectsReducer,
      notifications: notificationsReducer,
      modals: modalsReducer,
      error: errorReducer,
      activityLog: activityLogReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(throwMiddleware), 
  })
}

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']