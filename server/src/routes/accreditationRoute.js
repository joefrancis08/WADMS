import express from 'express';
import { addLevelController, fetchLevelsController } from '../controllers/accreditation/level/levelController.js';
import { deletePeriodController, fetchPeriodController } from '../controllers/accreditation/period/periodController.js';
import { addProgramAreaController, deletePAMController, fetchProgramAreaController } from '../controllers/accreditation/program-area-mapping/programAreaMappingController.js';
import { addAreaParameterController, deleteAreaParameterController, fetchAreaParameterController } from '../controllers/accreditation/area-parameter-mapping/areaParameterMappingController.js';
import { addParamSubParamController, deleteParamSubParamController, fetchParamSubParamController } from '../controllers/accreditation/param-subparam-mapping/paramSubparamController.js';
import { addAccredInfoController } from '../models/accreditation/accreditation-info/accreditationInfoController.js';
import { addILPController, fetchILPController } from '../controllers/accreditation/info-level-program-mapping/ILPController.js';
import { addSIMController, fetchSIMController } from '../controllers/accreditation/subparam-indicator-mapping/SIMController.js';
import fetchAreasBy from '../controllers/accreditation/areas/GET/fetchAreasBy.js';
import { addDocumentController, deleteDocController, fetchDocumentsController, updateDocController } from '../controllers/accreditation/document/documentController.js';
import { upload } from '../middlewares/uploadFile.js';
import { addAssignmentController, deleteAssignmentController, fetchAssignmentController } from '../controllers/accreditation/assignments/assignmentController.js';
import deleteILP from '../controllers/accreditation/info-level-program-mapping/DELETE/deleteILP.js';
import fetchProgramProgress from '../controllers/progress/program-progress/fetchProgramProgress.js';
import fetchParametersBy from '../controllers/accreditation/parameters/GET/fetchParametersBy.js';
import fetchSubparametersBy from '../controllers/accreditation/sub-parameters/GET/fetchSubparametersBy.js';
import fetchIndicatorBy from '../controllers/accreditation/indicator/GET/fetchIndicatorBy.js';

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', addLevelController);
accreditationRouter.post('/add-accreditation-info', addAccredInfoController);
accreditationRouter.post('/add-info-level-programs', addILPController);
accreditationRouter.post('/add-program-areas', addProgramAreaController);
accreditationRouter.post('/add-area-parameters', addAreaParameterController);
accreditationRouter.post('/add-parameter-subparameters', addParamSubParamController);
accreditationRouter.post('/add-subparameter-indicators', addSIMController);
accreditationRouter.post('/add-document', upload.single('file'), addDocumentController);
accreditationRouter.post('/add-assignment', addAssignmentController);

accreditationRouter.get('/fetch-accreditation-levels', fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', fetchPeriodController);
accreditationRouter.get('/fetch-info-level-programs', fetchILPController);
accreditationRouter.get('/fetch-program-areas', fetchProgramAreaController);
accreditationRouter.get('/fetch-program-areas-by', fetchAreasBy);
accreditationRouter.get('/fetch-area-parameters', fetchAreaParameterController);
accreditationRouter.get('/fetch-area-parameters-by', fetchParametersBy);
accreditationRouter.get('/fetch-parameter-subparameters', fetchParamSubParamController);
accreditationRouter.get('/fetch-parameter-subparameters-by', fetchSubparametersBy);
accreditationRouter.get('/fetch-subparameter-indicators', fetchSIMController);
accreditationRouter.get('/fetch-subparameter-indicators-by', fetchIndicatorBy);
accreditationRouter.get('/fetch-documents', fetchDocumentsController);
accreditationRouter.get('/fetch-assignments', fetchAssignmentController);
accreditationRouter.get('/fetch-program-progress', fetchProgramProgress);

accreditationRouter.patch('/rename-document/:docId', updateDocController);

accreditationRouter.delete('/delete-accreditation-period', deletePeriodController);
accreditationRouter.delete('/delete-info-level-program', deleteILP);
accreditationRouter.delete('/delete-program-area', deletePAMController);
accreditationRouter.delete('/delete-area-parameter', deleteAreaParameterController);
accreditationRouter.delete('/delete-param-subparam', deleteParamSubParamController);
accreditationRouter.delete('/delete-document', deleteDocController);
accreditationRouter.delete('/delete-assignment', deleteAssignmentController);

export default accreditationRouter;