import fetchParamSubparamMappings from "./GET/fetchParamSubparamMappings.js";
import addParamSubparamMapping from "./POST/addParamSubparamMapping.js";

export const addParamSubParamController = (req, res) => addParamSubparamMapping(req, res);
export const fetchParamSubParamController = (req, res) => fetchParamSubparamMappings(req, res);