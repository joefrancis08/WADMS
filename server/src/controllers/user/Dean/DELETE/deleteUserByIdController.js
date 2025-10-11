import { deleteUserSession } from "../../../../models/user/DELETE/deleteUserSession.js";
import { getUserBy } from "../../../../models/user/GET/getUser.js";
import { deleteUserById } from "../../../../models/userModel.js";
import path from "path";
import fs from "fs";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

export const deleteUserByIdController = async (req, res) => {
  const { uuid } = req.query;
  const PROFILE_PIC_PATH = process.env.PROFILE_PIC_PATH;

  console.log(uuid);

  try {
    const user = await getUserBy('user_uuid', uuid, true, false, true);

    console.log('Line 17:', user);

    if (!user) return res.status(404).json({
      message: 'User not found',
      success: false
    });

    const profilePic = user.profile_pic_path;

    const result = await deleteUserById(uuid);

    deleteUserSession(uuid);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    sendUpdate('user-update');

    if (profilePic) {
      const fullPath = path.join(PROFILE_PIC_PATH, profilePic);
      try {
        await fs.promises.unlink(fullPath);
        
      } catch (err) {
        console.error('Failed to delete profile picture:', err);
      }
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
