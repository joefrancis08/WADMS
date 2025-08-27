import express from 'express';
import { addProgramToBeAccredited } from '../controllers/program/programToBeAccreditedController.js';
import { addLevel } from '../controllers/accreditation/level/levelController.js';
import fetchProgramsToBeAccredited from '../controllers/accreditation/programs-to-be-accredited/GET/fetchProgramsToBeAccredited.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevel);
accreditationRouter.post('/add-programs-to-be-accredited', addProgramToBeAccredited);
accreditationRouter.get('/fetch-programs-to-be-accredited', fetchProgramsToBeAccredited);

export default accreditationRouter;