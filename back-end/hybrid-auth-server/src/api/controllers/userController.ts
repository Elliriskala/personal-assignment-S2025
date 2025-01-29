import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {UserDeleteResponse, UserResponse} from 'hybrid-types/MessageTypes';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  modifyUser,
} from '../models/userModel';
import {TokenContent, User, UserWithNoPassword} from 'hybrid-types/DBTypes';

const salt = bcrypt.genSaltSync(12);

/**
 * Get all users
 * @param req
 * @param res
 * @param next
 */
const userListGet = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by their id
 * @param req
 * @param res
 * @param next
 */
const userGet = async (
  req: Request<{id: string}>,
  res: Response<UserWithNoPassword>,
  next: NextFunction,
) => {
  try {
    const user = await getUserById(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 * @param req
 * @param res
 * @param next
 * @returns new user
 */
const userPost = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  req: Request<{}, {}, User>,
  res: Response<UserResponse>,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    user.password_hash = await bcrypt.hash(user.password_hash, salt);

    console.log(user);

    const newUser = await createUser(user);
    console.log('newUser', newUser);
    if (!newUser) {
      next(new CustomError('User not created', 500));
      return;
    }
    const response: UserResponse = {
      message: 'user created',
      user: newUser,
    };
    res.json(response);
  } catch {
    next(new CustomError('Duplicate entry', 400));
  }
};

/**
 * Update an user
 * @param req
 * @param res
 * @param next
 * @returns updated user
 */
const userPut = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  req: Request<{}, {}, User>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;

    const user = req.body;
    if (user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }

    console.log('userPut', userFromToken, user);

    const result = await modifyUser(user, userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    console.log('put result', result);

    const response: UserResponse = {
      message: 'user updated',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @param req
 * @param res
 * @param next
 * @returns user deleted message
 */
const userDelete = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    console.log('user from token', userFromToken);

    const result = await deleteUser(userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }
    console.log(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user to be an admin
 * @param req
 * @param res
 * @param next
 * @returns
 */
const userPutAsAdmin = async (
  req: Request<{id: string}, object, User>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }
    const user = req.body;
    if (user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }

    const result = await modifyUser(user, Number(req.params.id));

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'user updated',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete other users as an admin
 * @param req
 * @param res
 * @param next
 * @returns
 */
const userDeleteAsAdmin = async (
  req: Request<{id: string}>,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }

    const result = await deleteUser(Number(req.params.id));

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Check token
 * @param req
 * @param res
 * @param next
 * @returns success/error message
 */
const checkToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  const userFromToken = res.locals.user;
  // check if user exists in database
  const user = await getUserById(userFromToken.user_id);
  if (!user) {
    next(new CustomError('User not found', 404));
    return;
  }

  const message: UserResponse = {
    message: 'Token is valid',
    user: user,
  };
  res.json(message);
};

/**
 * Check if the email exists in the database
 * @param req
 * @param res
 * @param next
 */
const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  try {
    console.log('test email check', req.params.email);
    const user = await getUserByEmail(req.params.email);
    res.json({available: user ? false : true});
  } catch (error) {
    next(error);
  }
};

/**
 * Check if the username exists in the database
 * @param req
 * @param res
 * @param next
 */
const checkUsernameExists = async (
  req: Request<{username: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res.json({available: user ? false : true});
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userDelete,
  userPutAsAdmin,
  userDeleteAsAdmin,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
};
