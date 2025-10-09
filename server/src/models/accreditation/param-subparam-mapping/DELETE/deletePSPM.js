import db from "../../../../config/db.js";

const deletePSPM = async (data = {}, connection = null) => {
  const { pspmId, subParameterId, subParameter } = data;
  const query = `
    DELETE FROM parameter_subparameter_mapping WHERE id = ?
      AND subparameter_id = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [pspmId, subParameterId]);

    return {
      deletedSubParam: subParameter,
      deletedCount: result.affectedRows
    };
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deletePSPM;