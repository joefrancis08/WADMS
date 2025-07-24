import db from "../config/db.js";

// INSERT New User
export const insertUser = async (userUUID, fullName, email, password, role, status) => {
  const sql = `
    INSERT INTO user (user_uuid, full_name, email, password, role, status)
    VALUES (?, ?, ?, ?, ?, ?)  
  `;

  const [result] = await db.execute(sql, [userUUID, fullName, email, password, role, status]);
  return result;
};

// GET ALL Users
export const getAllUsers = async () => {
  const [rows] = await db.execute('SELECT * FROM user');
  return rows;
};

// GET User by ID
export const getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM user WHERE id = ?', [id]);
  return rows[0];
}

// GET User by email
export const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
  return rows[0];
}

// GET User by role
export const getUserByRole = async (role) => {
  const [rows] = await db.execute('SELECT * FROM user WHERE role = ?', [role]);
  return rows[0];
}

// UPDATE User
export const updateUserInfo = async (fullName, email, password, role, status, id) => {
  const sql = 'UPDATE user SET full_name = ?, email = ?, password = ?, role = ?, status = ?  WHERE id = ?';

  const [result] = await db.execute(sql, [fullName, email, password, role, status, id])
  return result;
}

// DELETE ALL Users
export const deleteAllUsers = async() => {
  const [rows] = await db.execute('TRUNCATE TABLE user');
  return rows;
}

// DELETE Users By ID
export const deleteUserById = async (id) => {
  const [result] = await db.execute('DELETE FROM user WHERE id = ?', [id]);
  return result;
};
