import deleteAssignment from "./DELETE/deleteAssignment.js";
import fetchAssignments from "./GET/fetchAssignments.js";
import addAssignment from "./POST/addAssignment.js";

export const addAssignmentController = (req, res) => addAssignment(req, res);

export const fetchAssignmentController = (req, res) => fetchAssignments(req, res);

export const deleteAssignmentController = (req, res) => deleteAssignment(req, res);