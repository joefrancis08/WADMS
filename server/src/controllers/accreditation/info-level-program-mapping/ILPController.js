import fetchILP from "./GET/fetchILP.js";
import addILP from "./POST/addILP.js";

export const addILPController = (req, res) => addILP(req, res);
export const fetchILPController = (req, res) => fetchILP(req, res);