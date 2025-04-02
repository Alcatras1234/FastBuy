import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./slice/auth/user";
import authOrganizerReducer from "./slice/auth/organizer";

const store = configureStore({
    reducer: {
        authUser: authUserReducer,  // ✅ Используем только reducer
        authOrganizer: authOrganizerReducer,  // ✅ Используем только reducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;