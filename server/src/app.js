import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://blogging-now.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
// app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Sever is rocking");
});

import userRoute from "./routes/user.routes.js";
import blogRoute from "./routes/blog.routes.js";
import likeRoute from "./routes/like.routes.js";
import commentRoute from "./routes/comment.routes.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/comment", commentRoute);

export { app };
