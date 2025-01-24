import { Router } from "express";
import {
  registerUser,
  userNameExists,
  login,
  profile,
  search,
  deleteUser,
  changeAvatarImage,
  changeBackgroundImage,
  retriveAllActiveUsers,
  showProfile,
  logoutUser,
  refreshAccessToken,
  verifyUser,
  someUserData,
  test,
  followUnfollow,
  // fetchAllFollowing,
  checkFollow,
  followers,
  following
} from "../controllers/user.controllers.js";
import { upload } from "../middlerwares/multer.middlerware.js";
import { verifyJWT } from "../middlerwares/auth.middlerware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatarImage",
      maxCount: 1,
    },
    {
      name: "backgroundImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/userNameExists").post(userNameExists);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT,logoutUser)
router.route("/verifyUser").get(verifyJWT,verifyUser);
router.route("/someUserData").get(verifyJWT,someUserData);
router.route("/profile").get(verifyJWT,profile);
router.route("/search").post(search);
router.route("/deleteUser").delete(verifyJWT,deleteUser);
router.route("/changeAvatarImage").put(verifyJWT,upload.fields([{name : "avatarImage", maxCount:1}]),changeAvatarImage)
router.route("/changeBackgroundImage").put(verifyJWT,upload.fields([{name : "backgroundImage", maxCount:1}]),changeBackgroundImage)
router.route("/showProfile/:userId").get(verifyJWT,showProfile);
router.route("/retriveAllActiveUsers").get(verifyJWT,retriveAllActiveUsers);
router.route("/followUnfollow").get(verifyJWT,followUnfollow);
router.route("/followers").get(verifyJWT,followers);
// router.route("/fetchAllFollowing").get(verifyJWT,fetchAllFollowing)
router.route("/checkFollow").get(verifyJWT,checkFollow);
router.route("/following").get(verifyJWT,following);
router.route("/test").get(test);
router.route("/refreshAccessToken").get(refreshAccessToken);

export default router;

