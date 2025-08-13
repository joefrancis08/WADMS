import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { handleBlankUserInput } from "../../../../utils/handleBlankField.js";
import { getUserByEmail, insertUser } from '../../../../models/userModel.js';
import { USER_STATUS } from '../../../../../../client/src/constants/user.js';
import { TOAST_MESSAGES } from '../../../../../../client/src/constants/messages.js';

export const addUserController = async (req, res) => {

  const {} = TOAST_MESSAGES;
  
  // Step 1: Get the data from the request body (from frontend)
  const {
    fullName,
    email,
    password = `${fullName}0@wdms`,
    userUUID = uuidv4(),
    role,
    status = USER_STATUS.VERIFIED
  } = req.body;

  // Step 2: Check if there are blank inputs
  if (handleBlankUserInput(res, fullName, email, role)) return;

  // Step 3: Use try/catch to insert data into database and to catch any errors if database queries are unsuccessful. Best practice when fetching or posting data
  try {
    // Step 3.1: Check if email already exists in the database and return a response
    const user = await getUserByEmail(email);

    if (user && user.email === email) {
      return res.status(409).json({
        message: 'Email already exists.',
        alreadyExist: true, 
      });
    }

    // Step 3.2: Proceed to inserting the user to the database if email does not exist and return the response
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcrypt
    await insertUser(userUUID, fullName, email, hashedPassword, role, status);
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
      message: "Something went wrong in our server.", 
      success: false 
    });
  }
};