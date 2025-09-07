import express from 'express';
import { addProgramToBeAccreditedController, deleteProgramToBeAccreditedController, fetchProgramToBeAccreditedController } from '../controllers/accreditation/programs-to-be-accredited/programToBeAccreditedController.js';
import { addLevelController, fetchLevelsController } from '../controllers/accreditation/level/levelController.js';
import { deletePeriodController, fetchPeriodController } from '../controllers/accreditation/period/periodController.js';
import { addProgramAreaController, fetchProgramAreaController } from '../controllers/accreditation/program-area-mapping/programAreaMappingController.js';
import { addAreaParameterController, fetchAreaParameterController } from '../controllers/accreditation/area-parameter-mapping/areaParameterMappingController.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevelController);
accreditationRouter.post('/add-programs-to-be-accredited', addProgramToBeAccreditedController);
accreditationRouter.post('/add-program-areas', addProgramAreaController);
accreditationRouter.post('/add-area-parameters', addAreaParameterController);
accreditationRouter.get('/fetch-accreditation-levels', fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', fetchPeriodController);
accreditationRouter.get('/fetch-programs-to-be-accredited', fetchProgramToBeAccreditedController);
accreditationRouter.get('/fetch-program-areas', fetchProgramAreaController);
accreditationRouter.get('/fetch-area-parameters', fetchAreaParameterController);
accreditationRouter.delete('/delete-accreditation-period', deletePeriodController);
accreditationRouter.delete('/delete-programs-to-be-accredited', deleteProgramToBeAccreditedController);

export default accreditationRouter;