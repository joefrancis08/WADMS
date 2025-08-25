import { getUserBy } from "../../../../models/user/GET/getUser.js"

export const confirmEmailController = async(req, res) => {
  try {
    const { email } = req.body;
    const response = await getUserBy('email', email, true);

    if (!response) {
      return res.status(200).json({
        successConfirmation: true,
        notRegistered: true
      });
    }

    return res.status(200).json({
      successConfirmation: true,
      user: response
    });
    
  } catch (error) {
    console.error('Error getting user by email: ', error);
  }
};