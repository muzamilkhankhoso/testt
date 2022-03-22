import express from 'express';
import IncidentController from '../controllers/IncidentController.js';
import verifyToken from "../helpers/validation.js"
const router = express.Router();

router.post('/postIncident',verifyToken, IncidentController.postIncident);
router.get('/getIncidents', verifyToken, IncidentController.getIncidents);
router.post('/deleteIncident', verifyToken, IncidentController.deleteIncident);
router.post('/updateIncident', verifyToken, IncidentController.updateIncident);


export default router;