import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {UserWithLevel, User, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {UserDeleteResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';

/**
 * Get user by their user_id
 * @param id
 * @returns user and their info
 */

const getUserById = async (id: number): Promise<UserWithNoPassword> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(
    `SELECT Users.user_id, Users.username, Users.email, Users.profile_picture, Users.profile_info, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.user_id = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

/**
 * Get all users
 * @returns all user and their info without password
 */

const getAllUsers = async (): Promise<UserWithNoPassword[]> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(
    `SELECT Users.user_id, Users.username, Users.email, Users.profile_picture, Users.profile_info, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id`,
  );
  return rows; // Return empty array if no users found
};

/**
 * Get user by email to check if the email exists
 * @param email
 * @returns
 */
const getUserByEmail = async (email: string): Promise<UserWithLevel> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT Users.user_id, Users.username, Users.password_hash, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.email = ?`,
    [email],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};


/**
 * Get user with thei username
 * @param username
 * @returns user by their username
 */

const getUserByUsername = async (username: string): Promise<UserWithLevel> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT Users.user_id, Users.username, Users.password_hash, Users.email, Users.profile_picture, Users.profile_info, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.username = ?`,
    [username],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

/**
 * Create a new user
 * @param user
 * @param userLevelId
 * @returns new user by their user id
 */

const createUser = async (
  user: Pick<User, 'username' | 'password_hash' | 'email' | 'user_level_id'>,
): Promise<UserWithNoPassword> => {
  const sql = `INSERT INTO Users (username, password_hash, email, user_level_id)
       VALUES (?, ?, ?, ?)`;
  const stmt = promisePool.format(sql, [
    user.username,
    user.password_hash,
    user.email,
    user.user_level_id
  ]);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);

  if (result.affectedRows === 0) {
    throw new CustomError('Failed to create user', 500);
  }

  return await getUserById(result.insertId);
};

/**
 * Update user info
 * @param user
 * @param id
 * @returns updated user
 */

const modifyUser = async (
  user: Partial<User>,
  id: number,
): Promise<UserWithNoPassword> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const allowedFields = ['username', 'email', 'password_hash', 'user_level_id', 'profile_picture', 'profile_info'];
    const updates = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key]) => `${key} = ?`);
    const values = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([, value]) => value);

    if (updates.length === 0) {
      throw new CustomError('No valid fields to update', 400);
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      throw new CustomError('User not found', 404);
    }

    const updatedUser = await getUserById(id);
    await connection.commit();
    return updatedUser;
  } finally {
    connection.release();
  }
};

/**
 * Delete user by their id
 * @param id
 * @returns message 'user deleted'
 */

const deleteUser = async (id: number): Promise<UserDeleteResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?;',
      [id],
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      throw new CustomError('User not found', 404);
    }

    console.log('result', result);
    return {message: 'User deleted', user: {user_id: id}};
  } finally {
    connection.release();
  }
};

export {
  getUserById,
  getAllUsers,
  getUserByUsername,
  getUserByEmail,
  createUser,
  modifyUser,
  deleteUser,
};
