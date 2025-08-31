import express from 'express';
import { addProgramToBeAccreditedController, deleteProgramToBeAccreditedController, fetchProgramToBeAccreditedController } from '../controllers/accreditation/programs-to-be-accredited/programToBeAccreditedController.js';
import { addLevelController, fetchLevelsController } from '../controllers/accreditation/level/levelController.js';
import { deletePeriodController, fetchPeriodController } from '../controllers/accreditation/period/periodController.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevelController);
accreditationRouter.post('/add-programs-to-be-accredited', addProgramToBeAccreditedController);
accreditationRouter.get('/fetch-accreditation-levels', fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', fetchPeriodController);
accreditationRouter.get('/fetch-programs-to-be-accredited', fetchProgramToBeAccreditedController);
accreditationRouter.delete('/delete-accreditation-period', deletePeriodController);
accreditationRouter.delete('/delete-programs-to-be-accredited', deleteProgramToBeAccreditedController);

export default accreditationRouter;