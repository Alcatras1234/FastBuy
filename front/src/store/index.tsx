import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth"; // Импортируем authSlice.reducer как authReducer

const store = configureStore({
    reducer: {
        auth: authSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;