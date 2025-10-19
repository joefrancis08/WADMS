import express from 'express';
import { addParameterController, fetchParametersController } from '../controllers/accreditation/parameters/parameterController.js';
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';

const { D, C, M, I, A } = allowedRoles();
const parameterRouter = express.Router();

parameterRouter.post('/add-parameters', authorize([D, C, M]) ,addParameterController);
parameterRouter.get('/fetch-parameters', authorize([D, C, M, I, A]) ,fetchParametersController);

export default parameterRouter;