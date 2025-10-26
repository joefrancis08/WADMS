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
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';
import fetchAreaProgress from '../controllers/progress/area-progress/fetchAreaProgress.js';
import fetchParamProgress from '../controllers/progress/parameter-progress/fetchParamProgress.js';
import fetchSubParamProgress from '../controllers/progress/subparameter-progress/fetchSubParamProgress.js';
import fetchIndicatorProgress from '../controllers/progress/indicator-progress/fetchIndicatorProgress.js';
import fetchAssignmentsByUserId from '../controllers/accreditation/assignments/GET/fetchAssignmentsByUserId.js';
import fetchDocumentsBy from '../controllers/accreditation/document/GET/fetchDocumentsBy.js';

const { D, M, C, I, A } = allowedRoles();

const accreditationRouter = express.Router();

accreditationRouter.post('/add-accreditation-level', authorize([D]), addLevelController);
accreditationRouter.post('/add-accreditation-info', authorize([D]), addAccredInfoController);
accreditationRouter.post('/add-info-level-programs', authorize([D]), addILPController);
accreditationRouter.post('/add-program-areas', authorize([D]), addProgramAreaController);
accreditationRouter.post('/add-area-parameters', authorize([D, M, C]), addAreaParameterController);
accreditationRouter.post('/add-parameter-subparameters', authorize([D, M, C]), addParamSubParamController);
accreditationRouter.post('/add-subparameter-indicators', authorize([D, M, C]), addSIMController);
accreditationRouter.post('/add-document', authorize([D, M, C]), upload.array('files', 10), addDocumentController);
accreditationRouter.post('/add-assignment', authorize([D]), addAssignmentController);

accreditationRouter.get('/fetch-accreditation-levels', authorize([D, M, C, I, A]), fetchLevelsController);
accreditationRouter.get('/fetch-accreditation-period', authorize([D, M, C, I, A]), fetchPeriodController);
accreditationRouter.get('/fetch-info-level-programs', authorize([D, M, C, I, A]), fetchILPController);
accreditationRouter.get('/fetch-program-areas', authorize([D, M, C, I, A]), fetchProgramAreaController);
accreditationRouter.get('/fetch-program-areas-by', authorize([D, M, C, I, A]), fetchAreasBy);
accreditationRouter.get('/fetch-area-parameters', authorize([D, M, C, I, A]), fetchAreaParameterController);
accreditationRouter.get('/fetch-area-parameters-by', authorize([D, M, C, I, A]), fetchParametersBy);
accreditationRouter.get('/fetch-parameter-subparameters', authorize([D, M, C, I, A]), fetchParamSubParamController);
accreditationRouter.get('/fetch-parameter-subparameters-by', authorize([D, M, C, I, A]), fetchSubparametersBy);
accreditationRouter.get('/fetch-subparameter-indicators', authorize([D, M, C, I, A]), fetchSIMController);
accreditationRouter.get('/fetch-subparameter-indicators-by', authorize([D, M, C, I, A]), fetchIndicatorBy);
accreditationRouter.get('/fetch-documents', authorize([D, M, C, I, A]), fetchDocumentsController);
accreditationRouter.get('/fetch-documents-by', authorize([D, M, C]), fetchDocumentsBy);
accreditationRouter.get('/fetch-assignments', authorize([D, M, C]), fetchAssignmentController);
accreditationRouter.get('/fetch-assignments-by-user-id', authorize([M, C]), fetchAssignmentsByUserId);
accreditationRouter.get('/fetch-program-progress', authorize([D]), fetchProgramProgress);
accreditationRouter.get('/fetch-area-progress', authorize([D]), fetchAreaProgress);
accreditationRouter.get('/fetch-parameter-progress', authorize([D]), fetchParamProgress);
accreditationRouter.get('/fetch-subparameter-progress', authorize([D]), fetchSubParamProgress);
accreditationRouter.get('/fetch-indicator-progress', authorize([D]), fetchIndicatorProgress);

accreditationRouter.patch('/rename-document/:docId', authorize([D, M, C]), updateDocController);

accreditationRouter.delete('/delete-accreditation-period', authorize([D]), deletePeriodController);
accreditationRouter.delete('/delete-info-level-program', authorize([D]), deleteILP);
accreditationRouter.delete('/delete-program-area', authorize([D]), deletePAMController);
accreditationRouter.delete('/delete-area-parameter', authorize([D, M, C]), deleteAreaParameterController);
accreditationRouter.delete('/delete-param-subparam', authorize([D, M, C]), deleteParamSubParamController);
accreditationRouter.delete('/delete-document', authorize([D, M, C]), deleteDocController);
accreditationRouter.delete('/delete-assignment', authorize([D, M, C]), deleteAssignmentController);

export default accreditationRouter;