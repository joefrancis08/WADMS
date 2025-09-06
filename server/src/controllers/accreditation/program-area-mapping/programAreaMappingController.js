import fetchProgramAreaMapping from "./GET/fetchProgramAreaMapping.js";
import addProgramAreaMapping from "./POST/addProgramAreaMapping.js";

export const addProgramAreaController = (req, res) => addProgramAreaMapping(req, res);
export const fetchProgramAreaController = (req, res) => fetchProgramAreaMapping(req, res);