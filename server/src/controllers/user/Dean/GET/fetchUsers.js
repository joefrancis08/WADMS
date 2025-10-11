import { getUserBy } from "../../../../models/user/GET/getUser.js";
import { getUsersModel } from "../../../../models/userModel.js";

export const fetchUsers = async (req, res) => {
  const conditions = Object.freeze({
    forTaskForce: true
  });

  const { 
    forTaskForce 
  } = conditions;

  try {
    let users;

    if (forTaskForce) {
      users = await getUsersModel({ forTaskForce });
    }
    
    res.status(200).json({
      success: true,
      data: users || []
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

export const fetchUnverifiedUsers = async (req, res) => {
  const { role } = req.query;

  try {
    const result = await getUserBy('role', role, false, false, true);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No user found with the role ${role}.`,
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      unverifiedUsers: result
    });

  } catch (error) {
    console.error(`Error fetching user by ${role}.`);
    throw error;
  }
};