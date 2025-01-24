import { likeDislikeBlog } from "../controllers/like.controllers.js";
import {Router} from "express"
import {verifyJWT} from "../middlerwares/auth.middlerware.js"
const router = Router();

router.route("/likeDislikeBlog").post(verifyJWT,likeDislikeBlog);

export default router;