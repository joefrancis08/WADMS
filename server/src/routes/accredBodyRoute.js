import express from 'express';
import { addAccredBodyController, fetchAccredBodies } from '../controllers/accreditation/bodies/accredbodyController.js';

const accredBodyRouter = express.Router();

accredBodyRouter.post('/add-accred-body', addAccredBodyController);

accredBodyRouter.get('/fetch-accreditation-bodies', fetchAccredBodies);

export default accredBodyRouter;

