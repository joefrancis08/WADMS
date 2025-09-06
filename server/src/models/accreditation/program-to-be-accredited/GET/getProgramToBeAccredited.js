import db from "../../../../config/db.js";

export const getProgramsToBeAccredited = async (connection = db) => {
  const query = `
    /* 
      This query retrieves accreditation details:
      - start and end dates of the period
      - level name
      - program name
    */
    SELECT
        ap.start_date     AS period_start,                  -- start date from accreditation_period
        ap.end_date       AS period_end,                    -- end date from accreditation_period
        l.level_name      AS level,                         -- level name from level table
        p.program_name    AS program                        -- program name from program table
    FROM program_level_mapping plm                          -- mapping table
    JOIN accreditation_period ap ON plm.period_id = ap.id   -- join with accreditation_period
    JOIN accreditation_level l ON plm.level_id = l.id       -- join with level
    JOIN program p ON plm.program_id = p.id                 -- join with program
    ORDER BY 
        ap.start_date ASC,                                  -- Latest period first
        FIELD(l.level_name, 'Preliminary', 'Level I', 'Level II', 'Level III', 'Level IV'), -- Custom level order
        plm.id ASC;                                         -- Latest program added first
  `;

  try {
    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error("Error fetching programs to be accredited:", error);
    throw error;
  }
};