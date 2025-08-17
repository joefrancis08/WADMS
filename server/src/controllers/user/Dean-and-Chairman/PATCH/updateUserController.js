import { getUserBy } from "../../../../models/user/GET/getUser.js";
import { updateUserInfo } from "../../../../models/userModel.js";
import sendUserUpdate from "../../../../services/websocket/sendUserUpdate.js";

export const updateUserController = async (req, res) => {
  const userUUID = req.params.uuid;
  const user = await getUserBy('user_uuid', userUUID);

  if (!user) {
    return res.status(404).json({
      message: 'User not found.',
      success: false
    });
  }

  const { 
    fullName, 
    email, 
    role
  } = req.body;

  try {
    const result = await updateUserInfo(fullName, email, role, userUUID);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found.',
        success: false
      });
    }

    sendUserUpdate();

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