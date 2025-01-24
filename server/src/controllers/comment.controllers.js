import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import {Comment} from "../models/comment.model.js"
import fs from "fs";
import mongoose from "mongoose";

    const retriveComment = AsyncHandler(async(req,res)=>{
        const {blogId} = req.query;
        if(!blogId){
            throw new ApiError(400, "blog id not found");
        }
        let blog = await Blog.findById(blogId);
        if(!blog){
            throw new ApiError(404,"no blog found");
        }
        let comments = await Blog.findById(blogId).select("comments -_id").populate({
            path:"comments",
    
            populate: {
                path:"by",
                select:"userName avatarImage createdAt ",
            }
        }).sort({"comments.updatedAt" : -1})
        // console.log(comments)
        
        if(comments.comments.length ===0 ){
            return res.json(new ApiResponse(404 , "no comments found", comments));
        }
        return res.status(200).json(new ApiResponse(200 , "comments found", comments));
    })

const addComment = AsyncHandler(async(req,res)=>{
    const {blogId,content} = req.body;
    const userId = req.user._id;
    if(!userId || !blogId || !content){
        throw new ApiError(400,"Some fields are empty");
    }
    let user = await User.findById(userId).select({ _id: 1 });  
    let blog = await Blog.findById(blogId).select({comments : 1,commentsCount:1});  

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    let comment = await Comment.create({
        by:userId,
        commentPost: blogId,
        content
    })  

    if(!comment){
        throw new ApiError(500,"comment creation failed")
    }
    else{
        await Blog.updateOne({_id: blogId},{
            $push : {comments : comment._id},
            $set:{commentsCount: (blog.commentsCount+1)}
        })
        return res.json(new ApiResponse(200,"Comment Created successfully"));
    }
})

const removeComment = AsyncHandler(async(req,res)=>{
    const {commentId} = req.query;
    const userId = req.user._id
    if(!commentId){
        throw new ApiError(400, "Comment Id is empty");
    }
    let comment = await Comment.findOne({_id: commentId});
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    else{
        if (userId.toString()===comment.by.toString()) {
            await Comment.deleteOne({_id: commentId});
            let blog = await Blog.findById(comment.commentPost).select("commentsCount");
            await Blog.updateOne({_id: comment.commentPost},{
                $pull: {comments: commentId},
                $set: {commentsCount: (blog.commentsCount-1)}
            });
            return res.status(200).json(new ApiResponse(200,"Comment deleted successfully",{}));
        } else {
            throw new ApiError(401, "you are not authorised to delete the comment");
        }
    }
})

const updateComment = AsyncHandler(async(req,res)=>{
    const {commentId,content} = req.body;
    const userId = req.user._id;
    if(!commentId || !content){
        throw new ApiError(400,"Comment Id or content is empty");
    }
    let comment = await Comment.findOne({_id:commentId});
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    else{
        if (userId.toString()===comment.by.toString()) {
            comment.content = content;
            await comment.save();
            return res.json(new ApiResponse(200,"Comment updated successfully",{}));
        } else {
            throw new ApiError(401,"you are not authorised tou update the comment")
        }
    }
})


export {
    addComment,
    removeComment,
    updateComment,
    retriveComment
}