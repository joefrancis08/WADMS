import { getUserById, getUsersByRole, getUserByStatus } from '../../models/userModel.js';
import { registerUserController } from './POST/registerUserController.js';
import { checkEmailController } from './GET/checkEmailController.js';
import { loginUserController } from './GET/loginUserController.js';
import { userSessionController } from './GET/userSessionController.js';
import { logoutUserController } from './POST/logoutUserController.js';
import { fetchAllUsersController, fetchUserController } from './GET/fetchUserController.js';
import { updateUserController } from './UPDATE/updateUserController.js';
import { updateUserRoleController } from './PATCH/updateUserRoleController.js';
import { deleteAllUsersController } from './DELETE/deleteAllUsersController.js';
import { deleteUserByIdController } from './DELETE/deleteUserByIdController.js';


export const registerUser = (req, res) => registerUserController(req, res); // Create new user
export const checkEmail = (req, res) => checkEmailController(req, res); // Check email
export const loginUser = (req, res) => loginUserController(req, res); // Login user
export const userSession = (req, res) => userSessionController(req, res); // Get session info
export const logoutUser = (req, res) => logoutUserController(req, res); // Logout user
export const fetchAllUsers = (req, res) => fetchAllUsersController(req, res); // Fetch all users
export const updateUser = (req, res) => updateUserController(req, res); // Update user
export const handleUpdateUserRole = (req, res) => updateUserRoleController(req, res); // Update user role
export const deleteAllUsers = async (req, res) => deleteAllUsersController(req, res); // Delete all users
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
