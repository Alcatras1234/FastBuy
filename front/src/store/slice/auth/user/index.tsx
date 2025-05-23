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

export const authSliceUser = createSlice({
    name: "authUser",
    initialState,
    reducers: {
        loginUserAction: function (state, action) {
            state.user = action.payload
            state.isLogged = true
        }
    }
})
export const {loginUserAction} = authSliceUser.actions;
export default authSliceUser.reducer;