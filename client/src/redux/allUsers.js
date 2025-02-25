import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "../utils/axios";
export const fetchAllUsers = createAsyncThunk("/user/allUsers",async(payload)=>{
    const {data} = await Axios.get("/user/retriveAllActiveUsers?page=1&limit=8");
    return data.data;
})
const initialState = {
    data: [],
    loaded: false
}

const allUsersSlice = createSlice({
    name:"allUsers",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllUsers.fulfilled ,(state,action)=>{
            state.loaded = true;
            state.data = action.payload
        })
        .addCase(fetchAllUsers.pending , (state)=>{
            state.loaded = false;
        })
    }
})

export default allUsersSlice.reducer