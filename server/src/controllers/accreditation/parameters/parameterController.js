import fetchParameters from "./GET/fetchParameters.js";
import addParameter from "./POST/addParameter.js";

export const addParameterController = (req, res) => addParameter(req, res);
export const fetchParametersController = (req, res) => fetchParameters(req, res);