import express from 'express';
import dailyPlanController from '../controllers/dailyPlanController.js';
import verifyToken from "../helpers/validation.js"
const router = express.Router();

router.post('/getDailyPlan',verifyToken, dailyPlanController.getDailyPlan);
router.post('/postDailyPlan', verifyToken, dailyPlanController.postDailyPlan);
router.post('/updateDailyPlan', verifyToken, dailyPlanController.updateDailyPlan);
router.post('/deleteDailyPlan', verifyToken, dailyPlanController.deleteDailyPlan);



export default router;
