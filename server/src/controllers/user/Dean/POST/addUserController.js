import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, insertUser } from '../../../../models/userModel.js';
import sendUpdate from '../../../../services/websocket/sendUpdate.js';
import { insertUserModel } from '../../../../models/user/POST/postUser.js';

export const addUserController = async (req, res) => {
  
  // Step 1: Get the data from the request body (from frontend)
  const { fullName, email, password = null, role = 'Unverified User', status = 'Pending'} = req.body;
  const profilePicPath = req.file ? req.file.filename : null;

  // Step 2: Check if there are blank inputs
  // if (handleBlankUserInput(res, fullName, email, password, role)) return;

  // Step 3: Use try/catch to insert data into database and to catch any errors if database queries are unsuccessful. Best practice when fetching or posting data
  try {
    // Step 3.1: Check if email already exists in the database and return a response
    const user = await getUserByEmail(email);

    if (user && user.email === email) {
      return res.status(200).json({
        message: 'Email already exists.',
        alreadyExist: true, 
      });
    }

    // Step 3.4: Hash the password
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    }

    // Step 3.2: Proceed to inserting the user to the database if email does not exist and return the response
    const userUUID = uuidv4();
    await insertUser(
      userUUID, 
      profilePicPath, 
      fullName, 
      email, 
      hashedPassword, 
      role, 
      status
    );

    sendUpdate('user-update');

    return res.status(201).json({
      message: 'User added successfully.',
      success: true,
    });

  } catch (err) {
    // Step 3.3: Return an error if any (typically server error)
    console.log(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true, 
      });
    }
    
    console.error(err);
    return res.status(500).json({ 
      message: "Something went wrong in our server.", err, 
      success: false 
    });
  }
};