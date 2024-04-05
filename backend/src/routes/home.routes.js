import { Router } from 'express';

import {
    getAllVideos,
} from "../controllers/home.controller.js"


const router = Router();

router.route('/').get(getAllVideos);


export default router;