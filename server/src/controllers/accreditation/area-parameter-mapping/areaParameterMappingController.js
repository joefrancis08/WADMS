import deleteAPM from "./DELETE/deleteAPM.js";
import fetchAreaParameterMappings from "./GET/fetchAreaParameterMappings.js";
import addAreaParameterMapping from "./POST/addAreaParameterMapping.js";

export const addAreaParameterController = (req, res) => addAreaParameterMapping(req, res);

export const fetchAreaParameterController = (req, res) => fetchAreaParameterMappings(req, res);

export const deleteAreaParameterController = (req, res) => deleteAPM(req, res);