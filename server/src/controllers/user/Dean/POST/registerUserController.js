import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, insertUser } from "../../../../models/userModel.js";
import { handleBlankUserInput } from "../../../../utils/handleBlankField.js";
import { insertUserModel } from '../../../../models/user/POST/postUser.js';

export const registerUserController = async (req, res) => {
  // Step 1: Get the data from the request body (typically from the frontend)
  const {
    fullName,
    email,
    password
  } = req.body;

  console.log({ fullName, email, password });

  // Step 2: Check if data from the request body is not blank
  if (handleBlankUserInput(res, fullName, email, password)) return;
  
  // Step 3: Use try/catch to catch any errors if database queries are unsuccessful. Best practice when fetching or posting data
  try {
    // Step 4: Check if email already exists in the database and return a response
    const user = await getUserByEmail(email);
    if (user && user.email === email) {
      return res.status(409).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true,
        user: null,
      });
    }

    // Step 5: Proceed to inserting the user to the database if email does not exist and return the response
    const userUUID = uuidv4();
    const role = 'Unverified User';
    const status = 'Pending';
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt

    console.log('line 40:', {
      userUUID, 
      profilePicPath: null, 
      fullName, 
      email, 
      password: hashedPassword, 
      role, 
      status
    });

    const insertResult = await insertUserModel({
      userUUID, 
      profilePicPath: null, 
      fullName, 
      email, 
      password: hashedPassword, 
      role, 
      status
    });

    // After successful insert:
    const newUser = {
      user_id: insertResult.insertId,
      user_uuid: userUUID,
      full_name: fullName,
      email: email,
      profile_pic_path: null,
      role: 'Unverified User',
      status: 'Pending'
    };

    req.session.user = {
      userId: newUser.user_id,
      userUUID: newUser.user_uuid,
      email: newUser.email,
      fullName: newUser.full_name,
      profilePicPath: newUser.profile_pic_path,
      role: newUser.role,
      status: newUser.status,
    };

    return res.status(201).json({ 
      message: 'User created successfully.', 
      success: true, 
      user: req.session.user
    });

  } catch (error) {
    // Step 6: Return an error if any (typically server error)
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true,
        user: null,
      });
    }
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong in our server.',
      success: false,
      user: null,
    });
  }
};