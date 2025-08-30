import deleteProgramToBeAccredited from "./DELETE/deleteProgramToBeAccredited.js";
import fetchProgramsToBeAccredited from "./GET/fetchProgramsToBeAccredited.js";
import addProgramToBeAccredited from "./POST/addProgramToBeAccredited.js";

export const addProgramToBeAccreditedController = (req, res) => addProgramToBeAccredited(req, res);
export const fetchProgramToBeAccreditedController = (req, res) => fetchProgramsToBeAccredited(req, res);
export const deleteProgramToBeAccreditedController = (req, res) => deleteProgramToBeAccredited(req, res);