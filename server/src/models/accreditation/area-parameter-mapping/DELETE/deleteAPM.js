import db from "../../../../config/db.js";

const deleteAPM = async (data = {}, connection = null) => {
  const { id, parameter } = data;
  const query = `DELETE FROM area_parameter_mapping WHERE id = ?`;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [id]);

    return {
      deletedParam: parameter,
      deletedCount: result.affectedRows
    };

  } catch (error) {
    console.error(error);
    throw error;
  }

};

export default deleteAPM;