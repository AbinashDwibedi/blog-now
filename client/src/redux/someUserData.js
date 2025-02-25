import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "../utils/axios";

export const fetchSomeUserData = createAsyncThunk("user/someUserData",async()=>{
    const {data} = await Axios.get("/user/someUserData");
    return data;
})

const initialState={
    userName:"",
    _id:"",
    avatarImage:"",
    following:[]
}

const someUserDataSlice = createSlice({
    name:"someUserData",
    initialState,
    // reducers:{
    //     setUserData: (state,action)=>{
    //         console.log(action)
    //         state.userName = action.payload.data?.userName || "";
    //         state.avatarImage = action.payload.data?.avatarImage || "";
    //     }
    // }
    extraReducers: (builder)=>{
        builder
        .addCase(fetchSomeUserData.fulfilled ,(state,action)=>{
            state.userName = action.payload.data?.userName || "";
            state.avatarImage = action.payload.data?.avatarImage || "";
            state._id = action.payload.data?._id || "";
            state.following = action.payload.data?.following ;
        })
    }
})

export const {setUserData} = someUserDataSlice.actions;
export default someUserDataSlice.reducer;