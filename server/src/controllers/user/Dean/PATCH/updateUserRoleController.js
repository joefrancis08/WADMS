import { getUserBy } from "../../../../models/user/GET/getUser.js";
import { updateUserRoleModel } from "../../../../models/user/UPDATE/updateUserModel.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

export const updateUserRoleController = async (req, res) => {
  const { uuid } = req.params;
  const { role } = req.body;

  console.log({uuid, role, status});

  try {
    const result = await updateUserRoleModel(uuid, role);

    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: 'User not found or role not changed.',
        success: false
      });
    }

    const user = await getUserBy('user_uuid', uuid, true);
    console.log(user.is_show_welcome);

    sendUpdate('user-update');

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