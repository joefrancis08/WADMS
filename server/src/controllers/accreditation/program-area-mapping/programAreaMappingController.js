import deletePAM from "./DELETE/deletePAM.js";
import fetchProgramAreaMapping from "./GET/fetchProgramAreaMapping.js";
import addProgramAreaMapping from "./POST/addProgramAreaMapping.js";

export const addProgramAreaController = (req, res) => addProgramAreaMapping(req, res);

export const fetchProgramAreaController = (req, res) => fetchProgramAreaMapping(req, res);

export const deletePAMController = (req, res) => deletePAM(req, res);