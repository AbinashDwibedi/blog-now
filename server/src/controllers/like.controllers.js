import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {Like} from "../models/like.model.js";
import {Blog} from "../models/blog.model.js"
import { uploadOnCloudinary ,deleteImageFromCloudinary} from "../utils/Cloudinary.js";
// import bcrypt from "bcrypt";
import fs from "fs";

const likeDislikeBlog = AsyncHandler(async (req, res) => {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
        return res.json(new ApiResponse(400, "User ID or Blog ID is not available", {}));
    }

    let user = await User.findById(userId).select({ _id: 1 });  
    let blog = await Blog.findById(blogId).select("likes");  

    if (!user) {
        return res.json(new ApiResponse(404, "User not found", {}));
    }

    if (!blog) {
        return res.json(new ApiResponse(404, "Blog not found", {}));
    }

    let existingLike = await Like.findOne({ by: userId, likedPost: blogId });
    if (existingLike) {
        let like = await Like.deleteOne({_id:existingLike._id});
        await Blog.findByIdAndUpdate(blogId,
            {$pull: {likes: existingLike._id}}
        )
        return res.json(new ApiResponse(200,"disliked successfully",existingLike))
    }

    let like = await Like.create({
        by: userId,
        likedPost: blogId
    });

    if (!like) {
        return res.json(new ApiResponse(500, "Something went wrong", {}));
    } else {
        await Blog.updateOne({_id : blogId},{
            $push: {likes: like._id}
        })
        return res.json(new ApiResponse(200, "Liked successfully", like));
    }
});



export {
    likeDislikeBlog,
}