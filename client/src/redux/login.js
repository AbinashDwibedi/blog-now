import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName : "",
    password : ""
}

const loginSlice = createSlice({
    name:"login",
    initialState,
    reducers:{
        addLoginFields: (state,action)=>{
            const {field , value} = action.payload;
            state[field] = value;
        }
    }
})

export const {addLoginFields} = loginSlice.actions;
export default loginSlice.reducer;