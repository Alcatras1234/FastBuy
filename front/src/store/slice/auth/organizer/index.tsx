import {createSlice} from "@reduxjs/toolkit";
import {IAuthState} from "../../../common/types/auth";

const initialState: IAuthState = {
    user: {
        role: '',
        accessToken: '',
        refreshToken: ''
    },
    isLogged : false,
}

export const authSliceOrganizer = createSlice({
    name: "authOrganizer",
    initialState,
    reducers: {
        loginOrganizerAction: function (state, action) {
            state.user = action.payload
            state.isLogged = true
        }
    }
})
export const {loginOrganizerAction} = authSliceOrganizer.actions;
export default authSliceOrganizer.reducer;