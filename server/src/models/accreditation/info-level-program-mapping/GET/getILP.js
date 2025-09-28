import db from "../../../../config/db.js";

const getILP = async (connection = db) => {
  const query = `
    /* 
      This query retrieves accreditation details:
      - year, title, and accreditation body
      - level name
      - program name
    */
    SELECT
        ai.uuid           AS accred_uuid,                             -- uuid from accreditation_info
        ai.title          AS accred_title,                            -- title of accreditation
        ai.year           AS accred_year,                             -- year of accreditation
        ab.name           AS accred_body_name,                        -- name of accreditation body(AACCUP, etc.)
        l.id              AS level_id,                                -- level id from level table
        l.level_name      AS level,                                   -- level name from level table
        p.uuid            AS program_uuid,                            -- program_uuid from program table
        p.program_name    AS program                                  -- program name from program table
    FROM info_level_program_mapping ilp                               -- mapping table
    JOIN accreditation_info ai 
      ON ilp.accreditation_info_id = ai.id                            -- join with accreditation_info
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id                             -- join with accreditation_body
    JOIN accreditation_level l 
      ON ilp.level_id = l.id                                          -- join with level
    JOIN program p 
      ON ilp.program_id = p.id                                        -- join with program
    ORDER BY 
      ai.year ASC,                                                    -- Latest period first
      FIELD(l.level_name, 'Preliminary', 'Level I', 'Level II', 'Level III', 'Level IV'), -- Custom level order
      ilp.id ASC;                                                     -- Latest program added first
  `;

  try {
    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error("Error fetching accreditation info, level, and programs:", error);
    throw error;
  }
};

export default getILP;