import express from 'express';
import { addAccredBodyController, fetchAccredBodies } from '../controllers/accreditation/bodies/accredbodyController.js';
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';

const { D } = allowedRoles;
const accredBodyRouter = express.Router();

accredBodyRouter.post('/add-accred-body', authorize([D]), addAccredBodyController);

accredBodyRouter.get('/fetch-accreditation-bodies', authorize([D]), fetchAccredBodies);

export default accredBodyRouter;

