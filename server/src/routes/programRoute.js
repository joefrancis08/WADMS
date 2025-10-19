import express from 'express';
import { addProgramController, fetchProgramController } from '../controllers/program/programController.js';
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';

const { D, C, M, I, A } = allowedRoles();

const programRouter = express.Router();

programRouter.post('/add-program', authorize([D]), addProgramController);
programRouter.get('/fetch-programs', authorize([D, C, M, I, A]), fetchProgramController);

export default programRouter;