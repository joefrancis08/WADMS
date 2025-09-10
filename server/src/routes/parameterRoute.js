import express from 'express';
import { addParameterController, fetchParametersController } from '../controllers/accreditation/parameters/parameterController.js';

const parameterRouter = express.Router();

parameterRouter.post('/add-parameters', addParameterController);
parameterRouter.get('/fetch-parameters', fetchParametersController);

export default parameterRouter;