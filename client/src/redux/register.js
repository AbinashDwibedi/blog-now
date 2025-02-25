import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName:"",
    fullName:"",
    email:"",
    password:"",
    confirmPassword:""
}

const registerSlice = createSlice({
    name:"register",
    initialState,
    reducers:{
        addUserDetails : (state,action)=>{
            let {field,value} = action.payload;
            state[field] = value;
        }
    }
})

export const {addUserDetails} = registerSlice.actions;
export default registerSlice.reducer;