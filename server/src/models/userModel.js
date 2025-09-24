import { deleteAllUsersModel, deleteUserByIdModel } from "./user/DELETE/deleteUserModel.js";
import { getAllUsersModel, getUserBy } from "./user/GET/getUser.js";
import { insertUserModel } from "./user/POST/postUser.js";
import { updateUserModel } from "./user/UPDATE/updateUserModel.js";

// POST/INSERT
export const insertUser = (userUUID, profilePicPath, fullName, email, password, role,status) => (
  insertUserModel({ userUUID, profilePicPath, fullName, email, password, role, status })
);

// GET
export const getAllUsers = () => getAllUsersModel(); // GET ALL Users
export const getUserById = (id) => getUserBy('user_uuid', id); // GET User by ID
export const getUserByEmail = (email) => getUserBy('email', email); // GET User by email
export const getUsersByRole = (role) => getUserBy('role', role, false); // GET Users by role
export const getUserByStatus = (status) => getUserBy('status', status, false); // GET Users by status

// UPDATE
export const updateUserInfo = (profilePicPath, fullName, email, role, uuid) => (
  updateUserModel(profilePicPath, fullName, email, role, uuid)
);

// DELETE
export const deleteAllUsers = () => deleteAllUsersModel(); 
export const deleteUserById = (uuid) => deleteUserByIdModel(uuid);
