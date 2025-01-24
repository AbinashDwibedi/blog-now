import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json(new ApiResponse(401,"access token not found",{}))
        }
        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("userName _id fullName avatarImage");

        if(!user){
            return res.status(401).json(new ApiResponse(401,"Invalid Access Token",{}))
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiResponse(401,"Invalid Access Token",{}))
    }
}