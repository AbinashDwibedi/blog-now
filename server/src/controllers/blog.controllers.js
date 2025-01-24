import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
// import { verifyJWT } from "../middlerwares/auth.middlerware.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/Cloudinary.js";
// import bcrypt from "bcrypt";
import fs from "fs";
import mongoose from "mongoose";

const uploadBlog = AsyncHandler(async (req, res) => {
  const { title, contentText, visibility } = req.body;
  const userId = req.user._id;
  const blogImagePath = req.files?.blogImage?.[0].path;
  if (!title || !contentText || !visibility || !userId) {
    if (blogImagePath) {
      fs.unlinkSync(blogImagePath);
    }
    throw new ApiError(400, "some values are missing");
  }

  let user = await User.findById({ _id: userId });
  if (!user) {
    if (blogImagePath) {
        fs.unlinkSync(blogImagePath);
      }
    throw new ApiError(404, "User not found");
  } else {
    let cloudinaryBlogImageResonse;
    if (blogImagePath) {
      cloudinaryBlogImageResonse = await uploadOnCloudinary(blogImagePath);
    }
    let blog = await Blog.create({
        by:userId,
        title,
        blogImage: cloudinaryBlogImageResonse?.url || "",
        contentText,
        visibility
    })

    user.blogs.push(blog._id);
    await user.save();
    return res.json(new ApiResponse(201,"Blog created successfully",{}));


  }
});


const updateBlog = AsyncHandler(async(req,res)=>{
    const { title, contentText, _id } = req.body;
    const userId = req.user._id;
    const blogImagePath = req.files?.blogImage?.[0].path;
    if(!title || !contentText || !_id){
        if(blogImagePath){
            fs.unlinkSync(blogImagePath);
        }
        throw new ApiError(400, "Some fields are empty");
    }
    let blog = await Blog.findOne({_id});
    if(!blog){
        if(blogImagePath){
            fs.unlinkSync(blogImagePath);
        }
        throw new ApiError(404,"No blog found");
    }
    else{
        if(userId.toString()===blog.by.toString()){
          let newCloudinaryBlogImageResponse;
        if(blogImagePath){
            if(blog.blogImage){
            await deleteImageFromCloudinary(blog.blogImage);
            }
            newCloudinaryBlogImageResponse = await uploadOnCloudinary(blogImagePath);
            blog.blogImage = newCloudinaryBlogImageResponse.url;
        }
        blog.title = title;
        blog.contentText = contentText;
        await blog.save();
        return res.json(new ApiResponse(200,"Blog is updated",{}));
      }
      else{
        throw new ApiError(401 , "you are not authorized to do this");
      }
    }
})

//something's going to happen in here
const showUserBlogs = AsyncHandler(async(req,res)=>{
  
  const {limit , page=1 , userId} = req.query;
  // console.log(userId , page , limit)
  if(limit === 0 || page < 1 || !userId){
    throw new ApiError(400, "Some value's are missing");
  }
  let user = await User.findById(userId);
  if(!user){
    throw new ApiError(404, "user not found");
  }
  let userBlogs = await User.findById(userId)
  .skip((page*limit)-limit)
  .limit(limit)
  .select("blogs")
  .populate("blogs" , "title contentText blogImage createdAt likesCount commentsCount by");
  console.log(userBlogs)
  return res.json(new ApiResponse(200, "blogs found", userBlogs?.blogs || []));
})


const deleteBlog = AsyncHandler(async(req,res)=>{
  const {blogId} = req.query;
  const userId = req.user._id;
  if(!blogId){
    throw new ApiError(400,"Blog id not found");
  }
  let blog = await Blog.findOne({_id: blogId});
  if(!blog){
    throw new ApiError(404,"Blog not found");
  }
  else{
    if(userId.toString()===blog.by.toString()){
      if(blog.blogImage){
      await deleteImageFromCloudinary(blog.blogImage);
    }
    await Blog.deleteOne({_id: blogId});
    return res.status(200).json(new ApiResponse(200,"Blog deleted successfully",{}));
  }
  else{
    throw new ApiError(401,"You are not authorised to do this");
  }
    }
    
})

const showAllBlogs = AsyncHandler(async(req,res)=>{
  const {limit, page=1} = req.query;
  if(!limit || !page){
    throw new ApiError(400,"page or limit should not be empty")
  }
  let blogs = await Blog.find({visibility:"public"}).skip((page*limit)-limit).limit(limit).sort({createdAt:-1}).populate("comments", "_id").populate("likes" , "_id").populate("by", "userName fullName avatarImage").select("-visibility");
  return res.json(new ApiResponse(200, "success",blogs));
})


// const {blogId} = req.query;HOM
  // if(!blogId){
  //   return res.json(new ApiResponse(400,"Blog id not found",{}));
  // }
  // let likesBy = await Blog.findOne({_id: blogId}).populate({
  //   // "likes", "by"
  //   path: "likes",
  //   select: "by",
  //   populate: {
  //     path: "by",
  //     select: "userName fullName avatarImage"
  //   }
  // }).select({_id:1,likes: 1})
  // if(likesBy.length===0){
  //   return res.json(new ApiResponse(404, "No likes found",{}))
  // }
   // return res.json(new ApiResponse(200, "Likes fetched successfully",likesBy.likes));

   // await Blog.aggregate([
    //   {$match : {
    //     _id :new mongoose.Types.ObjectId(blogId)
    //   }},
    //   {$project : {
    //     likes : 1
    //   }},
    //   {$addFields : {
    //     likeCount : {$size: "$likes"}
    //   }}
    // ]).then(result =>{
    //   likeCount = result
    // })

    // likeCount = await Blog.aggregate([
  //   {$match : {
  //     _id : blogId
  //   }},
  //   {$addFields : {
  //     likeCount : {$size: "$likes"}
  //   }}
  // ]);

const like = AsyncHandler(async(req,res)=>{
  const { blogId} = req.query;
  const userId = req.user._id;
  if(!userId || !blogId){
    throw new ApiError(400, "some field are empty");
  }
  let user = await User.findById(userId);
  if(!user){
    throw new ApiError(404, "user not found");
  }
  let blog = await Blog.findById(blogId);
  if(!blog){
    throw new ApiError(404, "blog not found");
  }
  let like = await Like.findOne({by: userId, likedPost: blogId});
  let likeCount = 0;
  if(!like){
    await Like.create({
      by: userId,
      likedPost: blogId
    }).then(async(liked)=> {
      blog.likesCount+= 1
      blog.likes.push(liked._id);
      await blog.save();
      likeCount = blog.likesCount;
    })
    return res.json(new ApiResponse(200, "liked successfully",{likeCount}))
  }
  await Like.findByIdAndDelete(like._id).then(async(disliked)=> {
    blog.likes.pull(disliked._id);
    blog.likesCount-=1
    await blog.save();
    likeCount = blog.likesCount
  })
  return res.json(new ApiResponse(200, "disliked successfully",{likeCount}))
})  


const blogLikesCount = AsyncHandler(async (req,res)=>{
  
})


const blogComments = AsyncHandler(async(req,res)=>{
  const {blogId} = req.query;
  if(!blogId){
    return res.json(new ApiResponse(400,"Blog id not found",{}));
  }
  let CommentsBy = await Blog.findOne({_id: blogId})
  .select("comments")
  .populate({
    path:"comments",
    select:"content by",
    populate:{
      path:"by",
      select:"userName avatarImage"
    }
  })
  if(CommentsBy.comments.length ===0){
    return res.json(new ApiResponse(404,"No comments yet"));
  }
  return res.json(new ApiResponse(200,"Comments fetched successfully",CommentsBy.comments));
  })  

const likedBlogs = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    if (!userId) {
      throw new ApiError(400, "User ID not found");
    }
  
    const liked = await Like.aggregate([
      {
        $match: { by: userId }, 
      },
      {
        $lookup: {
          from: "blogs", 
          localField: "likedPost", 
          foreignField: "_id", 
          as: "likedBlogs", 
        },
      },
      {
        $unwind: "$likedBlogs", 
      },
      {
        $replaceRoot: { newRoot: "$likedBlogs" }, 
      },
    ]);
  
    if(!liked){
      throw new ApiError(404,"nothing found");
    }
    return res.json(new ApiResponse(200, "fetched successfully",liked))
  });
  

export { 
    uploadBlog,
    updateBlog,
    showUserBlogs,
    showAllBlogs,
    deleteBlog,
    like,
    blogLikesCount,
    blogComments,
    likedBlogs
 };
