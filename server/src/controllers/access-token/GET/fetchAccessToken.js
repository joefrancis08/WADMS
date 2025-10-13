import getAccessToken from "../../../models/access-token/GET/getAccessToken.js";

const fetchAccessToken = async (req, res) => {
  try {
    const tokens = await getAccessToken();

    res.status(200).json({
      success: true,
      tokens
    });

  } catch (error) {
    console.error('Error fetching token:', error);
    
    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false
    });
  }
};

export default fetchAccessToken;