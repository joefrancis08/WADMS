import express from 'express';
import { addProgramtoAccredit } from '../controllers/program/programToAccreditController.js';
import { addLevel } from '../controllers/accreditation-level/levelController.js';
import fetchProgramsToBeAccredited from '../controllers/accreditation/GET/fetchProgramsToBeAccredited.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevel);
accreditationRouter.post('/add-program-to-accredit', addProgramtoAccredit);
accreditationRouter.get('/fetch-program-to-be-accredited', fetchProgramsToBeAccredited);

export default accreditationRouter;