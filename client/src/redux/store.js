import { configureStore } from "@reduxjs/toolkit";
import registerSlice from "./register.js"
import loginSlice from "./login.js"
import someUserDataSlice from "./someUserData.js"
import allBlogsReducer from "./allBlogs.js"
import allUsersReducer from "./allUsers.js"
import searchReducer from "./search.js"
import addBlogReducer from "./addBlog.js"
import profileReducer from "./profile.js"
export const store = configureStore({
    reducer:{
        register:registerSlice,
        login:loginSlice,
        someUserData:someUserDataSlice,
        allBlogs:allBlogsReducer,
        allUsers: allUsersReducer,
        search:searchReducer,
        addBlog:addBlogReducer,
        profile:profileReducer
    }
})