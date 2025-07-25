import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { insertUser, getAllUsers, getUserById, updateUserInfo, deleteAllUsers, deleteUserById, getUserByEmail, getUsersByRole } from '../models/userModel.js';
import { handleBlankUserInput } from '../utils/handleBlankField.js';

// Create new user
export const registerUser = async (req, res) => {
  // Step 1: Get the data from the request body (typically from the frontend)
  const {
    fullName,
    email,
    password,
    userUUID = uuidv4(),
    role = "Unverified User",
    status = "Pending",
  } = req.body;

  // Step 2: Check if data from the request body is not blank
  if (handleBlankUserInput(res, fullName, email, password)) return;
  
  // Step 3: Use try/catch to catch any errors if database queries are unsuccessful. Best practice when fetching or posting data
  try {
    // Step 4: Check if email already exists in the database and return a response
    const user = await getUserByEmail(email);
    if (user && user.email === email) {
      console.log(user, user.email);
      return res.status(200).json({
        message: 'Email already exists.',
        alreadyExists: true, 
      });
    }

    // Step 5: Proceed to inserting the user to the database if email does not exist and return the response
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt
    await insertUser(userUUID, fullName, email, hashedPassword, role, status);

    // Save user to session temporarily after registration
    req.session.user = {
      userUUID,
      email,
      fullName,
      role, 
      status
    };

    return res.status(201).json({ 
      message: "User created successfully.", 
      success: true, 
      user: req.session.user
    });

  } catch (err) {
    // Step 6: Return an error if any (typically server error)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true, 
      });
    }
    console.error(err);
    return res.status(500).json({ 
      message: "Something went wrong in our server.", 
      success: false 
    });
  }
};

// Check email
export const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      return res.status(200).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true,
        data: user
      });
    }

    return res.status(200).json({
      message: 'Email is available.',
      success: true,
      alreadyExists: false,
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
}

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'User not found.',
        success: false,
        isValid: false,
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: 'Invalid password.',
        success: false,
        isValid: false,
      });
    }

    // Save user to session
    req.session.user = {
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status
    };

    return res.json({
      data: req.session.user,
      message: 'Logged in successfully.',
      success: true,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
};

// Get session info
export const userSession = (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

// Logout user
export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({
        message: 'Logout failed. Could not destroy session.',
        success: false,
      });
    }

    res.clearCookie(process.env.SESSION_KEY);
    return res.status(200).json({
      message: 'Logged out successfully.',
      success: true,
    });
  });
};

// Fetch all users
export const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users.length ? users : 'No users yet.'
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

// Fetch users by Role
export const fetchUserByRole = async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Role is required as a query parameter.',
    });
  }

  try {
    const users = await getUsersByRole(role);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No users found with role: ${role}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error.',
    })
  }
};

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
