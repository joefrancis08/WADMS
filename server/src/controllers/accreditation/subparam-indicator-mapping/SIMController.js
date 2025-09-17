import fetchSIM from "./GET/fetchSIM.js";
import addSIM from "./POST/addSIM.js";

export const addSIMController = (req, res) => addSIM(req, res);
export const fetchSIMController = (req, res) => fetchSIM(req, res);