import { deleteAllUsersModel, deleteUserByIdModel } from "./user/DELETE/deleteUserModel.js";
import { getAllUsersModel, getUserBy } from "./user/GET/getUser.js";
import { insertUserModel } from "./user/POST/postUser.js";
import { updateUserModel, updateUserRoleModel } from "./user/UPDATE/updateUserModel.js";

// POST/INSERT
export const insertUser = (userUUID, fullName, email, password, role, status) => (
  insertUserModel(userUUID, fullName, email, password, role, status)
);

// GET
export const getAllUsers = () => getAllUsersModel(); // GET ALL Users
export const getUserById = (id) => getUserBy('user_uuid', id); // GET User by ID
export const getUserByEmail = (email) => getUserBy('email', email); // GET User by email
export const getUsersByRole = (role) => getUserBy('role', role, false); // GET Users by role
export const getUserByStatus = (status) => getUserBy('status', status, false); // GET Users by status


// UPDATE
export const updateUserInfo = (fullName, email, password, role, status, id) => (
  updateUserModel(fullName, email, password, role, status, id)
);
export const updateUserRole = (uuid, role, status) => updateUserRoleModel(uuid, role, status);

// DELETE
export const deleteAllUsers = () => deleteAllUsersModel(); 
export const deleteUserById = (uuid) => deleteUserByIdModel(uuid);
