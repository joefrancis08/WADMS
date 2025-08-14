import { deleteUserById } from "../../../../models/userModel.js";
import sendUserUpdate from "../../../../services/websocket/sendUserUpdate.js";

export const deleteUserByIdController = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await deleteUserById(uuid);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    sendUserUpdate();

    // If the deleted user is the logged-in user
    if (req.session.user?.uuid === uuid) {
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({
            message: 'Could not destroy session.',
            success: false,
          });
        }

        res.clearCookie(process.env.SESSION_KEY);
        return res.status(200).json({
          success: true,
          message: 'User deleted and session destroyed successfully.'
        });
      });
    } else {
      // For admin deleting another user
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully.'
      });
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user.'
    });
  }
};
