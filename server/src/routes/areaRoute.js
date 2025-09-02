import express from 'express';
import { addAreaController } from '../controllers/accreditation/areas/areaController.js';

const areaRouter = express.Router();

areaRouter.post('/add-area', addAreaController);

export default areaRouter;

