import mongoose, {Schema,model, mongo} from "mongoose";

const blogShcema = new Schema({
    by: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        default:"",
    },
    blogImage:{
        type: String,
        default:"",
    },
    contentText:{
        type:String,
        default:"",
        required: true,
    },
    visibility:{
        type:String,
        default:"public",
        enum:["private","public"],
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"
    }],
    likesCount: {
        type:Number,
        default:0
    },
    commentsCount: {
        type:Number,
        default:0
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],
},{timestamps: true})

export const Blog = model("Blog",blogShcema);