import deletePeriodFn from "./DELETE/deletePeriod.js";
import fetchPeriod from "./GET/fetchPeriod.js";

export const fetchPeriodController = (req, res) => fetchPeriod(req, res);
export const deletePeriodController = (req, res) => deletePeriodFn(req, res);