import {createSlice} from "@reduxjs/toolkit";
import {IAuthState} from "../../../common/types/auth";

const initialState: IAuthState = {
    user: {
        id: null,
        fullName: '',
        email: '',
    },
    isLogged : false,
}

export const authSlice = createSlice({
        name: "auth",
        initialState,
        reducers: {
            login: function (state, action) {
                state.user = action.payload
                state.isLogged = true
            }
        }
})
export const {login} = authSlice.actions;
export default authSlice.reducer;