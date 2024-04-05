import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/').post(verifyJWT,  upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]), publishAVideo).get(getAllVideos)

router.route("/:videoId").get(verifyJWT,getVideoById).patch(verifyJWT,upload.single("thumbnail"), updateVideo).delete(verifyJWT,deleteVideo);
 

// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router