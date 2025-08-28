import fetchLevels from "./GET/fetchLevels.js";
import addLevel from "./POST/addLevel.js";

export const addLevelController = (req, res) => addLevel(req, res);
export const fetchLevelsController = (req, res) => fetchLevels(req, res);