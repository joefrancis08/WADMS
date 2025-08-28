import express from 'express';
import { addProgramController, fetchProgramController } from '../controllers/program/programController.js';

const programRouter = express.Router();

programRouter.post('/add-program', addProgramController);
programRouter.get('/fetch-programs', fetchProgramController);

export default programRouter;