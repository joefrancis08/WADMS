import fetchBodies from "./GET/fetchBodies.js";
import addBody from "./POST/addBody.js"

export const addAccredBodyController = async (req, res) => {
  addBody(req, res);
};

export const fetchAccredBodies = async (req, res) => {
  fetchBodies(req, res);
};