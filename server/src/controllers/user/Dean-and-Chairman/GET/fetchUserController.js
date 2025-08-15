import { getAllUsers } from "../../../../models/userModel.js";

export const fetchAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users.length ? users : 'No users yet.'
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false, 
      message: 'Server Error'
    });
  }
};

export const fetchUserController = ({
  getParam,
  fetchFunction,
  paramName,
  notFoundMessage
}) => {
  return async (req, res) => {
    const param = getParam(req);

    if (!param) {
      return res.status(400).json({
        success: false,
        message: `${paramName} is required.`
      });
    }

    try {
      const result = await fetchFunction(param);

      const isNotFound = Array.isArray(result) ? result.length === 0 : !result;

      if (isNotFound) {
        return res.status(200).json({
          success: false,
          message: notFoundMessage(param)
        });
      }

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error(`Error fetching user(s) by ${paramName}:`, error);
      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  };
};