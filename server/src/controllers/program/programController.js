import fetchProgram from './GET/fetchProgram.js';
import addProgram from './POST/addProgram.js';

export const addProgramController = (req, res) => addProgram(req, res);
export const fetchProgramController = (req, res) => fetchProgram(req, res);