import { deleteUserById } from "../../../../models/userModel.js";
import sendUserUpdate from "../../../../services/websocket/sendUserUpdate.js";

export const deleteUserByIdController = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await deleteUserById(uuid);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        success: false,
        message: 'User not found.'
      });
    }

    sendUserUpdate();

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