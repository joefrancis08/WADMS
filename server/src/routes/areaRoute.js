import express from 'express';
import { addAreaController } from '../controllers/accreditation/areas/areaController.js';
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';

const { D, M, C } = allowedRoles();

const areaRouter = express.Router();

areaRouter.post('/add-area', authorize([D, C, M]), addAreaController);

export default areaRouter;

