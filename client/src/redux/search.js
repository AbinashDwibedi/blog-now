import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "../utils/axios";
import { toast } from "react-toastify";

export const fetchSearchResults = createAsyncThunk("/user/search",async(payload)=>{
    const {data} = await Axios.post("/user/search",{
            searchText : payload
    });

    return data.data;
})

const initialState = {
    data:[],
    searchBtnState:false,
    searchText:"",
    loaded:false,

}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchBtnState: (state) => {
            state.searchBtnState = !state.searchBtnState;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loaded = true;
                state.data = action.payload;
            })
            .addCase(fetchSearchResults.pending, (state) => {
                state.loaded = false;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.searchBtnState = false
                if (action.error.response) {
                    const { status, data } = action.error.response;
                    if (status === 400) {
                        toast.error("Some fields are empty");
                    } else if (status === 404) {
                        toast.error("User not found");
                    } else {
                        toast.error("An unexpected error occurred");
                    }
                } else {
                    toast.error("Network error or other unknown issue");
                }
            });
    },
});

export const { setSearchBtnState, setSearchText } = searchSlice.actions;
export default searchSlice.reducer;
