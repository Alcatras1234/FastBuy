import {createSlice} from "@reduxjs/toolkit";
import {IAuthState} from "../../../common/types/auth";

const initialState: IAuthState = {
    user: {
        id: null,
        fullName: '',
        role: '',
        email: ''
    },
    isLogged : false,
}

export const authSliceAdmin = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: function (state, action) {
            state.user = action.payload
            state.isLogged = true
        }
    }
})
export const {login} = authSliceAdmin.actions;
export default authSliceAdmin.reducer;