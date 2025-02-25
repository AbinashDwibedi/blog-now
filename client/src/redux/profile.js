import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "../utils/axios.js";

export const fetchUserData = createAsyncThunk("/user/profile", async (payload) => {
  const { data } = await Axios.get(`/user/showProfile/${payload}`);
  return data.data;
});

const initialState = {
  userData: [],
  loaded: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoaded: (state) => {
      state.loaded = !state.loaded;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loaded = true
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loaded = false;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.loaded = true
      });
  },
});

export const { setLoaded } = profileSlice.actions;
export default profileSlice.reducer;
