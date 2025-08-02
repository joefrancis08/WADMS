import { getUserById, updateUserInfo } from "../../../models/userModel.js";
import { handleBlankUserInput } from "../../../utils/handleBlankField.js";


export const updateUserController = async (req, res) => {
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