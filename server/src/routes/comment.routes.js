import {
    addComment,
    removeComment,
    updateComment,
    retriveComment
} from "../controllers/comment.controllers.js"
import {verifyJWT} from "../middlerwares/auth.middlerware.js"
import { Router } from "express";
const router = Router();

router.route("/addComment").post(verifyJWT,addComment);
router.route("/removeComment").delete(verifyJWT,removeComment);
router.route("/updateComment").put(verifyJWT,updateComment);
router.route("/retriveComment").get(verifyJWT,retriveComment);

export default router;