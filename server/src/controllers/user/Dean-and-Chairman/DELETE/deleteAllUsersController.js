import { deleteAllUsers, getAllUsers } from "../../../../models/userModel.js";
import sendUserUpdate from "../../../../services/websocket/sendUserUpdate.js";

export const deleteAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers(); // Get users directly from model

    if (!users || users.length === 0) {
      return res.status(200).json({
        message: 'No users to delete.',
        isEmpty: true
      });
    }

    await deleteAllUsers(); // Delete all if users exist

    sendUserUpdate();

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