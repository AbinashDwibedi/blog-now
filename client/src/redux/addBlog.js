import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    uploading:false,
    isOpen:false,
    title: "",
    contentText:"",
    visibility:"public"
}

const addBlogSlice = createSlice({
    name:"addBlog",
    initialState,
    reducers: {
        setBlogData: (state,action)=>{
            // console.log(action.payload);
            state[action.payload.field] = action.payload.value
        },
        setOpenClose: (state)=>{
            state.isOpen = !state.isOpen
        },
        setUploading: (state)=>{
            state.uploading = !state.uploading
        }
    }
})

export const {setBlogData,setOpenClose,setUploading} = addBlogSlice.actions;
export default addBlogSlice.reducer;