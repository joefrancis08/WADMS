import express from 'express';
import { addProgramtoAccredit } from '../controllers/program/programToAccreditController.js';
import { addLevel } from '../controllers/accreditation-level/levelController.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevel);
accreditationRouter.post('/add-program-to-accredit', addProgramtoAccredit);

export default accreditationRouter;