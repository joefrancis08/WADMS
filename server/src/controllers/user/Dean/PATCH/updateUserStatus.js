import { updateStatus } from "../../../../models/user/UPDATE/updateUserModel.js";

const updateUserStatus = async (req, res) => {
  const { uuid } = req.params;
  const { status } = req.body;

  console.log({ uuid, status });

  if (!uuid || !status) {
    return res.status(400).json({
      message: 'UUID and status is required.',
      success: false,
    });
  }

  try {
    const result = await updateStatus(uuid, status);

    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found.',
        success: false
      });
    }

    res.status(200).json({
      message: 'Status updated successfully.',
      success: result.affectedRows > 0,
    });

  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export default updateUserStatus;