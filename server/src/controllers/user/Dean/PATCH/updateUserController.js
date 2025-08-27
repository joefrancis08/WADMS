import { getUserBy } from "../../../../models/user/GET/getUser.js";
import { updateUserInfo } from "../../../../models/userModel.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

export const updateUserController = async (req, res) => {
  const userUUID = req.params.uuid;
  const { newFullName, newEmail, newRole } = req.body;
  const newProfilePicPath = req.file ? req.file.filename : null;
  try {
    const user = await getUserBy('user_uuid', userUUID);
    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
        success: false
      });
    }

    // If no new file, keep the old profile picture
    const profilePicToSave = newProfilePicPath || user.profile_pic_path;

    const result = await updateUserInfo(profilePicToSave, newFullName, newEmail, newRole, userUUID);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found.',
        success: false
      });
    }

    sendUpdate('user-update');

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