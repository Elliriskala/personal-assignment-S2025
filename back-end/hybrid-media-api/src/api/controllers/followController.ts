import {Request, Response, NextFunction} from 'express';
import {
  fetchAllUserFollowers,
  fetchAllUserFollowings,
  fetchFollowersCountByFollowoingId,
  fetchFollowingsCountByFollowerId,
  postFollow,
  deletefollowing
} from '../models/followModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Follow, TokenContent} from 'hybrid-types/DBTypes';

// get all users' followers
const followersListGet = async (
  req: Request,
  res: Response<Follow[]>,
  next: NextFunction,
) => {

  try {
    const followers = await fetchAllUserFollowers(Number(req.params.user_id));
    res.json(followers);
  } catch (error) {
    next(error);
  }
};

// get all users' followings
const followingsListGet = async (
  req: Request,
  res: Response<Follow[]>,
  next: NextFunction,
) => {
  try {
    const followings = await fetchAllUserFollowings(Number(req.params.user_id));
    res.json(followings);
  } catch (error) {
    next(error);
  }
};

// follow a new user
const followPost = async (
  req: Request<{}, {}, {follower_id: number, following_id: number}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await postFollow(
      Number(req.body.follower_id),
      Number(req.body.following_id)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// unfollow a user
const followDelete = async (
  req: Request<{}, {}, {follower_id: number, following_id: number}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    console.log('Received follower_id:', req.body.follower_id);
    console.log('Received following_id:', req.body.following_id);
    const result = await deletefollowing(
      Number(req.body.follower_id),
      Number(req.body.following_id),
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Fetch followers count by user id
const followersCountByUserIdGet = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const count = await fetchFollowersCountByFollowoingId(Number(req.params.id));
    res.json({count});
  } catch (error) {
    next(error);
  }
};

// Fetch followings count by user id
const followingsCountByUserIdGet = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const count = await fetchFollowingsCountByFollowerId(Number(req.params.id));
    res.json({count});
  } catch (error) {
    next(error);
  }
};

export {
  followersListGet,
  followingsListGet,
  followPost,
  followDelete,
  followersCountByUserIdGet,
  followingsCountByUserIdGet
};
