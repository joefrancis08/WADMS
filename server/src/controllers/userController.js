import bcrypt from 'bcrypt';
import { insertUser, getAllUsers, getUserById, updateUserInfo, deleteAllUsers, deleteUserById } from '../models/userModel.js';

// Create new user
export const createUser = async (req, res) => {
  const {
    fullName,
    email,
    password,
    role = "Unverified User",
    status = "Pending",
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt
    await insertUser(fullName, email, hashedPassword, role, status);

    return res.status(201).json({ 
      message: "User created successfully.", 
      success: true 
    });

  } catch (err) {
    // Handle duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'Email already exists.', 
        success: false,
        emailAlreadyExist: true
      });
    }

    // Fallback for other errors
    console.error(err);
    return res.status(500).json({ 
      message: "Error creating user.", 
      success: false 
    });
  }
};

// Fetch all users
export const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false, 
      message: 'Server Error'
    });
  }
};

// Fetch user by ID
export const fetchUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true, 
      data: user
    });

  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, password, role, status} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt
    const result = await updateUserInfo(fullName, email, hashedPassword, role, status, userId);

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
  const { id } = req.params;

  try {
    const result = await deleteUserById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

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
