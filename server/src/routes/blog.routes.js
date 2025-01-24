import { 
    uploadBlog,
    updateBlog,
    showUserBlogs,
    showAllBlogs,
    deleteBlog,
    like,
    blogComments,
    blogLikesCount,
    likedBlogs
 } from "../controllers/blog.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlerwares/auth.middlerware.js";
import { upload } from "../middlerwares/multer.middlerware.js";

const router = Router();

//As i have very less storage space available thats why i want people to upload single image as blog post.
router.route("/uploadBlog").post(verifyJWT,upload.fields([{name: "blogImage",maxCount: 1}]),uploadBlog);
router.route("/updateBlog").put(verifyJWT,upload.fields([{name: "blogImage",maxCount: 1}]),updateBlog);
router.route("/showUserBlogs").get(verifyJWT,showUserBlogs);
router.route("/showAllBlogs").get(verifyJWT,showAllBlogs);
router.route("/like").get(verifyJWT,like);
router.route("/blogLikesCount").get(verifyJWT,blogLikesCount)
router.route("/deleteBlog").delete(verifyJWT,deleteBlog);
router.route("/blogComments").get(verifyJWT,blogComments);
router.route("/likedBlogs").get(verifyJWT,likedBlogs)

export default router