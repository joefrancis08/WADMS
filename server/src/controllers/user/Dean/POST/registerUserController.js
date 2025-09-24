import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, insertUser } from "../../../../models/userModel.js";
import { handleBlankUserInput } from "../../../../utils/handleBlankField.js";
import { insertUserModel } from '../../../../models/user/POST/postUser.js';
import { getUserBy } from '../../../../models/user/GET/getUser.js';


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
      console.log(user, user.email);
      return res.status(200).json({
        message: 'Email already exists.',
        alreadyExists: true, 
      });
    }

    // Step 5: Proceed to inserting the user to the database if email does not exist and return the response
    const userUUID = uuidv4();
    const role = 'Unverified User';
    const status = 'Pending';
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt

    const insertResult = await insertUserModel({
      userUUID, 
      profilePicPath: null, 
      fullName, 
      email, 
      password: hashedPassword, 
      role, 
      status
    });

    const userResult = await getUserBy('id', insertResult.insertId, true);
    console.log(userResult);

    // Save user to session temporarily after registration
    req.session.user = {
      userId: userResult.user_id, 
      userUUID: userResult.user_uuid, 
      email: userResult.email, 
      fullName: userResult.full_name,
      profilePicPath: userResult.profile_pic_path, 
      role: userResult.role, 
      status: userResult.status
    };

    console.log(req.session.user);

    return res.status(201).json({ 
      message: 'User created successfully.', 
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
      message: 'Something went wrong in our server.', 
      success: false 
    });
  }
};