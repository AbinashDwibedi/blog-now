import mongoose, { Schema, model } from "mongoose";

const likeSchema = new Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index:true
    },
    likedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog", 
        required: true,
        index: true
    }
}, { timestamps: true });

likeSchema.index({by: 1,likedPost:1},{unique: true});

const Like = model("Like", likeSchema);

export {Like} ;
