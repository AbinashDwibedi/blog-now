import mongoose, { Schema,model } from "mongoose";

const commentSchema = new Schema({
    by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    commentPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    },
    content: {
        type: String,
        required: true,
    }
},{timestamps: true})

export const Comment = model("Comment",commentSchema);