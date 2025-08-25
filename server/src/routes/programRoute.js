import express from 'express';
import { addProgram } from '../controllers/program/programController.js';

const programRouter = express.Router();

programRouter.post('/add-program', addProgram);

export default programRouter;