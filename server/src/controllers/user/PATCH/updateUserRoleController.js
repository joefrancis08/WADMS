import { updateUserRole } from "../../../models/userModel.js";
import sendUserUpdate from "../../../services/websocket/sendUserUpdate.js";

export const updateUserRoleController = async (req, res) => {
  const { uuid } = req.params;
  const { role, status } = req.body;

  try {
    const result = await updateUserRole(uuid, role, status);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: 'User not found or role not changed.',
        success: false
      });
    }

    sendUserUpdate();

    return res.json({
      message: 'User role updated successfully.',
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error updationg user role:', error);
    return res.status(500).json({
      message: 'Server error while updating user role.',
      success: false
    });
  }
}