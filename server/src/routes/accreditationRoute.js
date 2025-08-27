import express from 'express';
import { addProgramtoAccredit } from '../controllers/program/programToBeAccreditedController.js';
import { addLevel } from '../controllers/accreditation/level/levelController.js';
import fetchProgramsToBeAccredited from '../controllers/accreditation/programs-to-be-accredited/GET/fetchProgramsToBeAccredited.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevel);
accreditationRouter.post('/add-program-to-be-accredited', addProgramtoAccredit);
accreditationRouter.get('/fetch-program-to-be-accredited', fetchProgramsToBeAccredited);

export default accreditationRouter;