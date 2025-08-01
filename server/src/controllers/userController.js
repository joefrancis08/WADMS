import bcrypt from 'bcrypt';
import { insertUser, getAllUsers, getUserById, updateUserInfo, deleteAllUsers, deleteUserById, getUserByEmail, getUsersByRole, updateUserRole, getUserByStatus } from '../models/userModel.js';
import { handleBlankUserInput } from '../utils/handleBlankField.js';
import sendUserUpdate from '../services/websocket/sendUserUpdate.js';
import { registerUserController } from './POST/registerUserController.js';
import { checkEmailController } from './GET/checkEmailController.js';
import { loginUserController } from './GET/loginUserController.js';
import { userSessionController } from './GET/userSessionController.js';
import { logoutUserController } from './POST/logoutUserController.js';
import { fetchAllUsersController, fetchUserController } from './GET/fetchUserController.js';



export const registerUser = (req, res) => registerUserController(req, res); // Create new user
export const checkEmail = (req, res) => checkEmailController(req, res); // Check email
export const loginUser = async (req, res) => loginUserController(req, res); // Login user
export const userSession = (req, res) => userSessionController(req, res); // Get session info
export const logoutUser = (req, res) => logoutUserController(req, res); // Logout user
export const fetchAllUsers = async (req, res) => fetchAllUsersController(req, res); // Fetch all users

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

// Update user (For users, except Dean (admin))
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({
      message: 'User not found.',
      success: false
    });
  }

  const { 
    userUUID = user.userUUID,
    fullName, 
    email, 
    password, 
    role = user.role, 
    status= user.status
  } = req.body;

  if (handleBlankUserInput(res, fullName, email, password)) return;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt
    const result = await updateUserInfo(userUUID, fullName, email, hashedPassword, role, status, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found.',
        success: false
      });
    }

    res.json({
      message: 'User updated successfully.',
      success: true,
    })

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Server error.'
    })
  }
}

// Update user role
export const handleUpdateUserRole = async (req, res) => {
  const { uuid } = req.params;
  const { role, status } = req.body;

  try {
    const result = await updateUserRole(uuid, role, status);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: 'User not found or role not changed.',
        success: false
      });
    }

    sendUserUpdate();

    return res.json({
      message: 'User role updated successfully.',
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error updationg user role:', error);
    return res.status(500).json({
      message: 'Server error while updating user role.',
      success: false
    });
  }
}

// Delete all users
export const deleteUsers = async (req, res) => {
  try {
    const users = await getAllUsers(); // Get users directly from model

    if (!users || users.length === 0) {
      return res.status(200).json({
        message: 'No users to delete.',
        isEmpty: true
      });
    }

    await deleteAllUsers(); // Delete all if users exist

    return res.status(200).json({
      message: 'All users deleted successfully.',
      success: true,
      deletedCount: users.length
    });

  } catch (error) {
    console.error('Error deleting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting users.'
    });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await deleteUserById(uuid);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: 'User not found.'
      });
    }

    sendUserUpdate();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user.'
    });
  }
};
