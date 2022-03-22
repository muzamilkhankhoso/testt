import express from "express"
import homeController from "../controllers/homeController.js"
import verifyToken from "../helpers/validation.js"

const router = express.Router()

router.post('/UpdateWelcomeContent',verifyToken,homeController.UpdateWelcomeContent)
router.get('/getWelcomeContent',verifyToken,homeController.getWelcomeContent)

router.post('/UpdateWalkthroughContent',verifyToken,homeController.UpdateWalkthroughContent)
router.get('/getWalkthroughContent',verifyToken,homeController.getWalkthroughContent)





export default router