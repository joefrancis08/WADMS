import express from 'express';
import { deleteProgramToBeAccreditedController } from '../controllers/accreditation/programs-to-be-accredited/programToBeAccreditedController.js';
import { addLevelController, fetchLevelsController } from '../controllers/accreditation/level/levelController.js';
import { deletePeriodController, fetchPeriodController } from '../controllers/accreditation/period/periodController.js';
import { addProgramAreaController, deletePAMController, fetchProgramAreaController } from '../controllers/accreditation/program-area-mapping/programAreaMappingController.js';
import { addAreaParameterController, fetchAreaParameterController } from '../controllers/accreditation/area-parameter-mapping/areaParameterMappingController.js';
import { addParamSubParamController, fetchParamSubParamController } from '../controllers/accreditation/param-subparam-mapping/paramSubparamController.js';
import { addAccredInfoController } from '../models/accreditation/accreditation-info/accreditationInfoController.js';
import { addILPController, fetchILPController } from '../controllers/accreditation/info-level-program-mapping/ILPController.js';
import { addSIMController, fetchSIMController } from '../controllers/accreditation/subparam-indicator-mapping/SIMController.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevelController);
accreditationRouter.post('/add-accreditation-info', addAccredInfoController);
accreditationRouter.post('/add-info-level-programs', addILPController);
accreditationRouter.post('/add-program-areas', addProgramAreaController);
accreditationRouter.post('/add-area-parameters', addAreaParameterController);
accreditationRouter.post('/add-parameter-subparameters', addParamSubParamController);
accreditationRouter.post('/add-subparameter-indicators', addSIMController);

accreditationRouter.get('/fetch-accreditation-levels', fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', fetchPeriodController);
accreditationRouter.get('/fetch-info-level-programs', fetchILPController);
accreditationRouter.get('/fetch-program-areas', fetchProgramAreaController);
accreditationRouter.get('/fetch-area-parameters', fetchAreaParameterController);
accreditationRouter.get('/fetch-parameter-subparameters', fetchParamSubParamController);
accreditationRouter.get('/fetch-subparameter-indicators', fetchSIMController);

accreditationRouter.delete('/delete-accreditation-period', deletePeriodController);
accreditationRouter.delete('/delete-programs-to-be-accredited', deleteProgramToBeAccreditedController);
accreditationRouter.delete('/delete-program-area', deletePAMController);

export default accreditationRouter;