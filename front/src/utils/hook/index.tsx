import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import {AppDispatch, RootState} from "../../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAuth = (role: "USER" | "ORGANIZER") => {
    return useAppSelector((state: RootState) =>
        role === "USER" ? state.authUser.isLogged : state.authOrganizer.isLogged
    );
};