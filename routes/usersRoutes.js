import express from 'express';
import UserController from '../controllers/UserController.js';
import verifyToken from "../helpers/validation.js"

const router = express.Router();

router.post('/getProfile',verifyToken, UserController.getProfile);
router.post('/updateProfile',verifyToken, UserController.updateProfile);
router.post('/updateUserPassword', verifyToken,UserController.updateUserPassword);
router.post('/updateSetting', verifyToken,UserController.updateSetting);
router.get('/getSettings', verifyToken,UserController.getSettings);



export default router;