const getAccredInfoBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'title', 'year', 'status', 'accreditation_body_id'
  ];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, title, year
    FROM accreditation_info
    WHERE ${column} = ?
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [value]);

    return rows;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAccredInfoBy;