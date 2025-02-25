// export const fetchLikedBlogs = createAsyncThunk("/blogs/likedBlogs",async(payload)=>{
//   const {data} = await Axios.get("/blog/likedBlogs");
//   return data.data
// })
  // title: "",
  // contentText: "",
  // blogImage:"",
  // likes:0,
  // comments:0,
  // userName:"",
  // fullName:"",
  // avatarImage:"",
  // createdAt:"",
  // userId:"",
  // loaded: false,
// .addCase(fetchLikedBlogs.fulfilled, (state, action) => {
      //   state.data = action.payload;
      //   state.loaded = true;
      // })
      // .addCase(fetchLikedBlogs.pending, (state) => {
      //   state.loaded = false;
      // })


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "../utils/axios";
export const fetchAllBlogs = createAsyncThunk("/blogs/allBlogs", async (payload) => {
  const { data } = await Axios.get(`/blog/showAllBlogs/?limit=4&page=${payload.pageNo}`);
  // console.log(payload.pageNo)
  return data.data;
});


export const handleLikes = createAsyncThunk(
  "/blogs/blog/like",
  async (payload) => {
    const { data } = await Axios.get(`/blog/like?&blogId=${payload.blogId}`);
    // console.log(data.data.likeCount , payload.index)
    return {likesCount: data.data.likeCount , blogIndex:payload.index};
  }
);

const initialState = {

  data: [],
  loaded: false,
  hasMore:true,
};

const allBlogsSlice = createSlice({
  name: "allBlogs",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        if (action.meta.arg.pageNo === 1) {
          state.data = action.payload;
        } else {
          state.data = [...state.data, ...action.payload];
        }
        state.loaded = true;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loaded = false;
      })
      .addCase(handleLikes.fulfilled, (state, action) => {
        let newBlogData = [...(state.data)];
        newBlogData[action.payload.blogIndex].likesCount = action.payload.likesCount;
        state.data = newBlogData;
      })
      
      
  },
});

export default allBlogsSlice.reducer;
