import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary ,deleteImageFromCloudinary} from "../utils/Cloudinary.js";
import bcrypt from "bcrypt";
import fs, { access } from "fs";
import jwt from "jsonwebtoken"
import { Blog } from "../models/blog.model.js";


//generating access and refresh token

const generateAccessandRefreshToken =async (userId) =>{
  try {
    let user = await User.findById(userId);
    let accessToken = await user.generateAccessToken();
    let refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, "Access token and refresh token creation failed try again");
  }
}



const registerUser = AsyncHandler(async (req, res) => {
  const { userName, fullName, email, password } = req.body;
  // console.log(userName,fullName,email,password)
  if ([userName, fullName, email, password].some((str) => str === "")) {
    // throw new ApiError(400, "Some fields are empty");
    throw new ApiError(400, "Some fields are empty");
  }
  const userNameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  let verifyUserName = userNameRegex.test(userName);
  if(!verifyUserName){
    throw new ApiError(401,"Invalid username");
  }
  const findUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!findUser) {
    const avatarImagePath = req.files?.avatarImage?.[0]?.path;
    const backgroundImagePath = req.files?.backgroundImage?.[0]?.path;

    let cloudinaryAvatarResponse;
    let cloudinaryBackgroundResponse;
    if (avatarImagePath) {
      cloudinaryAvatarResponse = await uploadOnCloudinary(avatarImagePath);
    }
    if (backgroundImagePath) {
      cloudinaryBackgroundResponse = await uploadOnCloudinary(
        backgroundImagePath
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      userName,
      fullName,
      email,
      avatarImage: cloudinaryAvatarResponse?.url || "",
      backgroundImage: cloudinaryBackgroundResponse?.url || "",
      password: encryptedPassword,
    });
    //.select("-password -blog") this only can be used with find findOne etc
    if (!user) {
      // throw new ApiError(500,"User creation failed");
      throw new ApiError(500, "User Creation Failed" );
    }
    user = user.toObject();
    delete user.blogs;
    // delete user.followers;
    // delete user.following;
    delete user.isActive;
    delete user.password;

    // const {blogs,followers,following,isActive,password, ...userWithoutSensitiveData} = user;
    res.json(
      new ApiResponse(200, "User created Successfully", {})
    );

    // res.status(202).json(
    //   new ApiResponse(202, "successful retrived", {
    //     userName,
    //     fullName,
    //     email,
    //   })
    // );
  } else {
    // throw new ApiError(409,"User already Exists");
    throw new ApiError(409, "User Already Exist's");
  }
});

const userNameExists = AsyncHandler(async (req, res) => {
  const { userName } = req.body;
  if (!userName) {
    throw new ApiError(400, "User Name is Empty");
  }

  const user = await User.findOne({ userName });

  if (!user) {
    return res.status(200).json(new ApiResponse(200, "User name available", {}));
  }

  throw new ApiError(409, "User name already taken");
});

const login = AsyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName|| !password) {
    throw new ApiError(400, "Username or Password is empty");
  }
  
  const userNameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  let verifyUserName = userNameRegex.test(userName);
  if(!verifyUserName){
    throw new ApiError(401,"Invalid username");
  }
  let user = await User.findOne({ userName }).select("-blog -isActive -blogs -backgroundImage");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  } else {
    let comparePassword = await bcrypt.compare(password, user.password);
    user = user.toObject();
    delete user.password;
    if (comparePassword) {
      const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id);
      const options = {
        httpOnly:true,
        secure:true,
        sameSite: "None",
        path : "/",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
      // console.log(refreshToken,accessToken)
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(new ApiResponse(200, "Logged in successfully", {userName : user.userName}));

    } else {
      throw new ApiError(401, "Password incorrect");
    }
  }
});

const logoutUser = AsyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $unset : {
      refreshToken:1
    },
  },
  {
    new: true
  })

  const options = {
    httpOnly: true,
    secure: true,
    path:"/",
    sameSite:"none"
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,"logout successfully",{}));

})

  const verifyUser = AsyncHandler(async(req,res)=>{
      return res.status(200).json(new ApiResponse(200,"User Verified",req.user))
  })

const refreshAccessToken = AsyncHandler(async(req,res)=>{
  const currentRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
  if(!currentRefreshToken){
    throw new ApiError(401,"unauthorised request")
  }
  try {
    const decodedToken =await jwt.verify(currentRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    let user = await User.findById(decodedToken._id);
    if(!user){
      throw new ApiError(401,"Invalid refresh token")
    }
    if(currentRefreshToken!==user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired")
    }
    const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure:true,
      sameSite:"none",
      path:"/",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,"Access code refreshed",{}))

  } catch (error) {
    throw new ApiError(401,"Invalid Refresh token")
  }
})


const someUserData = AsyncHandler(async(req,res)=>{

  const userId = req.user._id;
  let user = await User.findById(userId).select("userName avatarImage following");
  return res.json(new ApiResponse(200,"User data retrived successfully",user))
})


//I have some doubt in this section 
const profile = AsyncHandler(async (req, res) => {
  const _id = req.user;
  if(!_id){
    throw new ApiError(400, "id is empty")
  }
  let user = await User.findOne({ _id }).select("-password -refreshToken -blogs -createdAt -updatedAt");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, "User data fetched successfully",user));
});

const search = AsyncHandler(async (req, res) => {
  const { searchText } = req.body;
  
  if (!searchText) {
    throw new ApiError(400, "Search text is empty");
  }

    const results = await User.find({
      $or: [
        { userName: { $regex: searchText, $options: "i" } }, 
        { fullName: { $regex: searchText, $options: "i" } },
      ],
    }).select("userName fullName avatarImage").limit(7); 

    if (results.length === 0) {
      throw new ApiError(404,"No users found" );
    }

    return res.status(200).json(new ApiResponse(200,"User's searched successfully",results));
  
});


const deleteUser = AsyncHandler(async(req,res)=>{
  const {password} = req.body;
  const _id = req.user._id;
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;
  if(!_id || !password){
    throw new ApiError(400,"user id or password is empty");
  }
  let userAndBlog= await User.findOne({_id}).select("blogs _id avatarImage backgroundImage password")
  .populate({
    path: "blogs",
    select:  "_id blogImage"
  })
  let blogsArray = userAndBlog.blogs;

  
  if(!userAndBlog){
    throw new ApiError(404,"user not found");
  }
  else{
    let checkPassword = await bcrypt.compare(password,userAndBlog.password);
    if(checkPassword){
      await Promise.all(
        blogsArray.map(async (blog) => {
          await Blog.findByIdAndDelete(blog._id);
        })
      );
      //removing the cloudinary images;
      try {
        if (userAndBlog.avatarImage) {
          await deleteImageFromCloudinary(userAndBlog.avatarImage);
        }
  
        if (userAndBlog.backgroundImage) {
          await deleteImageFromCloudinary(userAndBlog.backgroundImage);
        }
        
      } catch (error) {
        throw new ApiError(500, "Error deleting images from Cloudinary");
      }
    let deletedUser = await User.findByIdAndDelete(_id)
    const options = {
      httpOnly:true,
      secure:true
    }
    return res
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,"User Deleted Successfully",deletedUser));
    }
    
    else{
      throw new ApiError(401,"password incorrect");
    }
    
  }
})

const changeAvatarImage = AsyncHandler(async(req,res)=>{
  const _id = req.user._id;
  const avatarImagePath = req.files?.avatarImage?.[0].path;
  
  if(_id ===""){
    //As iam giving response so i have to delete the avatar image uploaded
    if(avatarImagePath){
      fs.unlinkSync(avatarImagePath);
    }
    throw new ApiError(400,"Give a valid user id");
    
  }
  if(!avatarImagePath){
    throw new ApiError(400,"Unable to upload avatar image");
  }
  let user = await User.findOne({_id});
  if(!user){
    //removing avatar Image if available
    if(avatarImagePath){
      fs.unlinkSync(avatarImagePath);
    }
    throw new ApiError(404,"User does not exist")
  }
  else{
    if(user.avatarImage){
      await deleteImageFromCloudinary(user.avatarImage);
    }
    const cloudinaryAvatarResponse = await uploadOnCloudinary(avatarImagePath);
    if(!cloudinaryAvatarResponse){
      throw new ApiError(500 , "Unable to upload avatar Image")
    }
    else{
      user.avatarImage = cloudinaryAvatarResponse.url
      await user.save();
      return res.status(200).json(new ApiResponse(200,"Avatar uploaded successfully",{avatarImage: user.avatarImage}));
    }
  }
})

const changeBackgroundImage = AsyncHandler(async(req,res)=>{
  const _id = req.user._id;
  const backgroundImagePath = req.files?.backgroundImage?.[0].path;
  
  if(_id ===""){
    //As iam giving response so i have to delete the background image uploaded
    if(backgroundImagePath){
      fs.unlinkSync(backgroundImagePath);
    }
    return res.json(new ApiResponse(400,"Give a valid user id",{}));
    
  }
  if(!backgroundImagePath){
    return res.json(new ApiResponse(400,"Unable to upload background image",{}));
  }
  let user = await User.findOne({_id});
  if(!user){
    //removing background Image if available
    if(backgroundImagePath){
      fs.unlinkSync(backgroundImagePath);
    }
    return res.json(new ApiResponse(404,"User does not exist",{}))
  }
  else{
    if(user.backgroundImage){
      await deleteImageFromCloudinary(user.backgroundImage);
    }
    const cloudinarybackgroundResponse = await uploadOnCloudinary(backgroundImagePath);
    if(!cloudinarybackgroundResponse){
      return res.json(new ApiResponse(500 , "Unable to upload background Image",{}))
    }
    else{
      user.backgroundImage = cloudinarybackgroundResponse.url
      await user.save();
      return res.json(new ApiResponse(200,"background uploaded successfully",{backgroundImage: user.backgroundImage}));
    }
  }
})

const showProfile = AsyncHandler(async (req,res)=>{
  const userId = req.params?.userId;
  if(!userId){
    throw new ApiError(400,"User id not found");
  }
  let user = await User.findOne({_id:userId}).select("-password -refreshToken -blogs -followers -following");
  if(!user){
    throw new ApiError(404,"User not found")
  }
  return res.json(new ApiResponse(200,"User retrived successfully",user));
})

const retriveAllActiveUsers = AsyncHandler(async(req,res)=>{
  const userId = req.user._id;
  const {page=1 , limit} = req.query;
  if(page<0 || !limit){
    throw new ApiError(400,"either page is less then zero or limit is empty");
  }
  // let user = await User.find()
  // .limit(limit)
  // .skip((page*limit)-limit)
  // .select("userName fullName avatarImage ");
  let user = await User
  .findById(userId)
  .select("following -_id")
  .populate("following","userName avatarImage fullName")
  .limit(limit)
  .skip((page*limit)-limit)
  if(user.length===0){
    throw new ApiError(404,"User's not found");
  }
  return res.json(new ApiResponse(200,"user's retrived successfully",user.following));
})

// //not necessary
// const fetchAllFollowing = AsyncHandler(async(req,res)=>{
//   const userId  = req.user._id;
//   if(!userId){
//     throw new ApiError(400, "no user id found");
//   }
//   let user = await User.findById(userId).select("following -_id");
//   if(!user){
//     throw new ApiError(404, "user not found");
//   }
//   return res.json(new ApiResponse(200, "users found",user));
// })

const checkFollow = AsyncHandler(async(req,res)=>{
  const userId= req.user._id;
  const {followUser} = req.query;
  const user = await User.findOne({
    _id:userId,
    following: {$elemMatch : {$eq : followUser}}
  }).select("userName")
  if(user){
    return res.json(new ApiResponse(200, "found", true));
  }
  return res.json(new ApiResponse(200, "not found", false))
  
})

const followUnfollow = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { followingUserId } = req.query;

  if (!userId || !followingUserId) {
    throw new ApiError(400, "Some IDs are missing");
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followingUserId)) {
    throw new ApiError(400, "Invalid user IDs");
  }

  const session = await User.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    const followingUser = await User.findById(followingUserId).session(session);

    if (!user || !followingUser) {
      throw new ApiError(404, "User not found");
    }

    const isFollowing = user.following.includes(followingUserId);

    if (!isFollowing) {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { following: followingUserId },
          $inc: { followingCount: 1 },
        },
        { session }
      );

      await User.findByIdAndUpdate(
        followingUserId,
        {
          $addToSet: { followers: userId },
          $inc: { followersCount: 1 },
        },
        { session }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { following: followingUserId },
          $inc: { followingCount: -1 },
        },
        { session }
      );

      await User.findByIdAndUpdate(
        followingUserId,
        {
          $pull: { followers: userId },
          $inc: { followersCount: -1 },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.json(new ApiResponse(200, "Operation successful", {}));
  } catch (error) {
    console.error("Transaction Error:", error);
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "An error occurred while processing the request", error);
  }
});

  
const followers = AsyncHandler(async(req,res)=>{
  const {userId} = req.query;
  if(!userId){
    throw new ApiError(400, "no user id found");
  }
  let user = await User.findById(userId).select("followers -_id").populate("followers","userName avatarImage fullName");
  if(!user){
    throw new ApiError(404,"no user found");
  }
  return res.json(new ApiResponse(200,"followers found",user.followers))
})
const following = AsyncHandler(async(req,res)=>{
  const {userId} = req.query;
  if(!userId){
    throw new ApiError(400, "no user id found");
  }
  let user = await User.findById(userId).select("following -_id").populate("following","userName avatarImage fullName");
  if(!user){
    throw new ApiError(404,"no user found");
  }
  return res.json(new ApiResponse(200,"following found",user.following))
})
const test = AsyncHandler(async(req,res)=>{
  res.send("it's working ");
})
export {
   registerUser,
    userNameExists,//not implemented
     login ,
     profile,
     someUserData,
     search,
     deleteUser,
     changeAvatarImage,
     changeBackgroundImage,
     showProfile,
     retriveAllActiveUsers,
     logoutUser,
     refreshAccessToken,
     verifyUser,
     followUnfollow,
    //  fetchAllFollowing,
     checkFollow,
     following,
     followers,
     test
    };
