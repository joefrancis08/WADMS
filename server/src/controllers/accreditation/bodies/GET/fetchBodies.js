import getAccredBody from "../../../../models/accreditation/bodies/GET/getAccredBody.js";

const fetchBodies = async (req, res) => {
  try {
    const result = await getAccredBody();
    console.log(result);

    res.status(200).json({
      message: 'Accreditation body fetched successfully!',
      data: result
    });

  } catch (error) {
    console.log('Error fetching accreditation bodies:', error);
    throw error;
  }
};

export default fetchBodies;