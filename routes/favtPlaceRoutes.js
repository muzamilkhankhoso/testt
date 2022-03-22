import express from 'express';
import favouritePlacesController from '../controllers/favouritePlacesController.js';
import verifyToken from "../helpers/validation.js"
const router = express.Router();

router.post('/getfavouritePlaces',verifyToken, favouritePlacesController.getfavouritePlaces);
router.post('/updatefavouritePlaces', verifyToken, favouritePlacesController.updatefavouritePlaces);
router.post('/postfavouritePlaces', verifyToken, favouritePlacesController.postfavouritePlaces);
router.post('/deleteFavouritePlace', verifyToken, favouritePlacesController.deleteFavouritePlace);



export default router;