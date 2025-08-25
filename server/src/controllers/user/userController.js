import { getUserById, getUsersByRole, getUserByStatus } from '../../models/userModel.js';
import { registerUserController } from './Dean/POST/registerUserController.js';
import { checkEmailController } from './Dean/GET/checkEmailController.js';
import { loginUserController } from './Dean/GET/loginUserController.js';
import { userSessionController } from './Dean/GET/userSessionController.js';
import { logoutUserController } from './Dean/POST/logoutUserController.js';
import { fetchAllUsersController, fetchUserController } from './Dean/GET/fetchUserController.js';
import { updateUserController } from './Dean/PATCH/updateUserController.js';
import { deleteAllUsersController } from './Dean/DELETE/deleteAllUsersController.js';
import { deleteUserByIdController } from './Dean/DELETE/deleteUserByIdController.js';
import { addUserController } from './Dean/POST/addUserController.js';
import { confirmEmailController } from './Dean/POST/confirmEmailController.js';

export const registerUser = (req, res) => registerUserController(req, res); // Create new user
export const addUser = (req, res) => addUserController(req, res);
export const checkEmail = (req, res) => checkEmailController(req, res); // Check email
export const confirmEmail = (req, res) => confirmEmailController(req, res);
export const loginUser = (req, res) => loginUserController(req, res); // Login user
export const userSession = (req, res) => userSessionController(req, res); // Get session info
export const logoutUser = (req, res) => logoutUserController(req, res); // Logout user
export const fetchAllUsers = (req, res) => fetchAllUsersController(req, res); // Fetch all users
export const updateUser = (req, res) => updateUserController(req, res); // Update user
export const deleteAllUsers = (req, res) => deleteAllUsersController(req, res); // Delete all users
export const deleteUser = (req, res) => deleteUserByIdController(req, res); // Delete user by ID

// Fetch user by ID
export const fetchUserById = fetchUserController({
  getParam: req => req.params.id,
  fetchFunction: getUserById,
  paramName: 'ID',
  notFoundMessage: id => `User not found with an ID ${id}`
});

export const fetchUserByRole = fetchUserController({
  getParam: req => req.query.role,
  fetchFunction: getUsersByRole,
  paramName: 'Role',
  notFoundMessage: role => `No users found with role ${role}`
});

export const fetchUserByStatus = fetchUserController({
  getParam: req => req.query.status,
  fetchFunction: getUserByStatus,
  paramName: 'Status',
  notFoundMessage: status => `No users found with status ${status}`
});
