import db from "../../../../config/db.js";
import getAreaParameterMappings from "../../../../models/accreditation/area-parameter-mapping/GET/getAreaParameterMappings.js";
import insertDocument from "../../../../models/accreditation/documents/POST/insertDocument.js";
import getParamSubparamMappings from "../../../../models/accreditation/param-subparam-mapping/GET/getParamSubparamMappings.js";
import getProgramAreaMapping from "../../../../models/accreditation/program-area-mapping/GET/getProgramAreaMapping.js";
import getSIM from "../../../../models/accreditation/subparam-indicator-mapping/GET/getSIM.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addDocument = async (req, res) => {
  // Step 1: Get the data from the request body (from frontend)
  const { 
    title, 
    year, 
    accredBody, 
    level, 
    program,
    area,
    parameter = null,
    subParameter = null,
    file,
    uploadedBy = null
  } = req.body;
  const filePath = req.file ? req.file.path : null;
  const fileName = req.file ? req.file.filename : null;

  // Step 2: Validate required fields
  if (
    !title || !year || !accredBody || !level || !program || !area || !filePath || !fileName
  ) {
    return res.status(400).json({
      message: 'Missing required fields'
    });
  }

  // Get a database connection
  const connection = await db.getConnection();

  // Step 3: Get the ID of the mappings
  try {
    await connection.beginTransaction();

    let pamId = null;
    let apmId = null;
    let pspmId = null;
    let simId = null;

    // 3.1 Get PAM ID
    const [pamResult] = await getProgramAreaMapping({
      title, 
      year, 
      accredBody, 
      level, 
      program,
      connection
    });
    
    if (pamResult && pamResult.id) pamId = pamResult.id;

    //3.2 Get APM ID
    const [apmResult] = await getAreaParameterMappings({
      title,
      year,
      accredBody,
      level,
      program,
      area,
      connection
    });

    if (apmResult && apmResult.id) apmId = apmResult.id;

    //3.3 Get PSPM ID (if parameter is provided)
    if (parameter) {
      const [pspmResult] = await getParamSubparamMappings({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter,
        connection
      });

      if (pspmResult && pspmResult.id) pspmId = pspmResult.id;
    }

    // 3.4 Get SIM ID (if sub-parameter is provided)
    if (subParameter && !parameter) {
      const [simResult] = await getSIM({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter,
        subParameter,
        connection
      });

      if (simResult && simResult.id) simId = simResult.id;
    }

    // Step 4: Validate that required mappings were found
    if (!pamId || !apmId) {
      await connection.rollback();
      return res.status(404).json({ 
        message: 'Required mapping not found (PAM or APM)' 
      });
    }

    // Step 5: Insert the document into the database
    const insertResult = await insertDocument({
        pamId, 
        apmId, 
        pspmId, 
        simId, 
        uploadedBy, 
        filePath, 
        fileName
      }, connection
    );

    if (insertResult.affectedRows === 0) {
      throw new Error('Failed to insert document');
    }

    await connection.commit();

    // Step 6: Send update via WebSocket
    sendUpdate('document-update');

    // Step 6: Send success response
    res.status(201).json({
      message: `${fileName} added successfully!`,
      fileName
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding document:', error);

    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false
    });

  } finally {
    connection.release();
  }
};

export default addDocument;