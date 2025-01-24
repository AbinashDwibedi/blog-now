import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs"

const app = express();

app.use(cors({
    // origin: "http://localhost:5173",
    origin:"https://blogging-now.web.app",
    credentials:true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.static("static"));
app.use(express.urlencoded({extended: true}));
// app.use(globalErrorHandler);


app.get("/",(req,res)=>{
    res.send("Sever is rocking");
})

import userRoute from "./routes/user.routes.js"
import blogRoute from "./routes/blog.routes.js"
import likeRoute from "./routes/like.routes.js"
import commentRoute from "./routes/comment.routes.js"

app.use("/api/v1/user",userRoute);
app.use("/api/v1/blog",blogRoute);
app.use("/api/v1/like",likeRoute);
app.use("/api/v1/comment",commentRoute);

export {app};