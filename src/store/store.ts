import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/app.reducer";
import authReducer from "./auth/auth.reducer";
import projectsReducer from "./projects/projects.reducer";
import { notificationsReducer } from "./notifications/notifications.reducer";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      projects: projectsReducer,
      notifications: notificationsReducer
    }
  })
}

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']