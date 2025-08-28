import express from 'express';
import { addProgramToBeAccreditedController } from '../controllers/accreditation/programs-to-be-accredited/programToBeAccreditedController.js';
import { addLevelController, fetchLevelsController } from '../controllers/accreditation/level/levelController.js';
import fetchProgramsToBeAccredited from '../controllers/accreditation/programs-to-be-accredited/GET/fetchProgramsToBeAccredited.js';
import { fetchPeriodController } from '../controllers/accreditation/period/periodController.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevelController);
accreditationRouter.get('/fetch-accreditation-levels', fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', fetchPeriodController);
accreditationRouter.post('/add-programs-to-be-accredited', addProgramToBeAccreditedController);
accreditationRouter.get('/fetch-programs-to-be-accredited', fetchProgramsToBeAccredited);

export default accreditationRouter;