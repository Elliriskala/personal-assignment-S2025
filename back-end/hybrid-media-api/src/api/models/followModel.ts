import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Follow} from 'hybrid-types/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

/**
 * Fetch all users' followers based on their id
 * @returns all the followers
 */
const fetchAllUserFollowers = async (id: number): Promise<Follow[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Follow[]>(
      'SELECT follower_id FROM Follows where following_id = ?',
      [id],
    );
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw new CustomError('Failed to fetch followers', 500);
  }
};

/**
 * Fetch all users that user is following based on their user id
 * @returns all users' followings
 */
const fetchAllUserFollowings = async (id: number): Promise<Follow[]> => {
  console.log('SELECT * FROM Follows WHERE follower_id = ' + id);
  const [rows] = await promisePool.execute<RowDataPacket[] & Follow[]>(
    'SELECT following_id FROM Follows where follower_id = ?',
    [id],
  );
  return rows;
};

/**
 * Request a count of users' followers
 * @returns a cout of the followers
 */
const fetchFollowersCountByFollowoingId = async (
  id: number,
): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {FollowersCount: number}[]
  >('SELECT COUNT(*) as FollowersCount FROM Follows WHERE following_id = ?', [
    id,
  ]);
  return rows[0].FollowersCount;
};

/**
 * Request a count of users' followings
 * @returns a cout of the followings
 */
const fetchFollowingsCountByFollowerId = async (
  id: number,
): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {FollowingsCount: number}[]
  >('SELECT COUNT(*) as FollowingsCount FROM Follows WHERE follower_id = ?', [
    id,
  ]);
  return rows[0].FollowingsCount;
};

/**
 * Follow a new user
 * @param follower_id
 * @param following_id
 * @returns
 */
const postFollow = async (
  follower_id: number,
  following_id: number,
): Promise<MessageResponse> => {
  const [existingFollower] = await promisePool.execute<
    RowDataPacket[] & Follow[]
  >('SELECT * FROM Follows WHERE follower_id = ? AND following_id = ?', [
    follower_id,
    following_id,
  ]);

  if (existingFollower.length > 0) {
    throw new CustomError(ERROR_MESSAGES.FOLLOW.ALREADY_EXISTS, 400);
  }

  const result = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Follows (follower_id, following_id) VALUES (?, ?)',
    [follower_id, following_id],
  );

  if (result[0].affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.FOLLOW.NOT_CREATED, 500);
  }

  return {message: 'Follower added'};
};

/**
 * Unfollow user
 * @param follower_id
 * @param following_id
 * @returns success/error message
 */
const deletefollowing = async (
  follower_id: number,
  following_id: number,
): Promise<MessageResponse> => {
  const sql = 'DELETE FROM Follows WHERE follower_id = ? AND following_id = ?';
  const params = [follower_id, following_id];

  console.log('Executing SQL:', sql, 'with params:', params);

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);
  console.log('SQL Result:', result);

  if (result.affectedRows === 0) {
    console.log('No rows were deleted. Possible causes:');
    console.log('- The follow relationship does not exist.');
    console.log('- The values do not match an existing row in the database.');
    throw new CustomError(ERROR_MESSAGES.FOLLOW.NOT_DELETED, 400);
  }

  return {message: 'User unfollowed'};
};

export {
  fetchAllUserFollowers,
  fetchAllUserFollowings,
  fetchFollowingsCountByFollowerId,
  fetchFollowersCountByFollowoingId,
  postFollow,
  deletefollowing,
};
