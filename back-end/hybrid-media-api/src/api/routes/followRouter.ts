import express from 'express';
import {authenticate, validationErrors} from '../../middlewares';
import {body, param} from 'express-validator';
import {
  followersListGet,
  followingsListGet,
  followPost,
  followDelete,
  followersCountByUserIdGet,
  followingsCountByUserIdGet,
} from '../controllers/followController';

const router = express.Router();

// get all followers of a user
router
  .route('/followers/:user_id')
  .get(
    param('user_id').isInt({min: 1}).toInt(),
    validationErrors,
    followersListGet,
  );

// get all user followings
router
  .route('/followings/:user_id')
  .get(
    param('user_id').isInt({min: 1}).toInt(),
    validationErrors,
    followingsListGet,
  );

// follow a new user
router
  .route('/')
  .post(
    authenticate,
    body('follower_id').isInt({min: 1}).toInt(),
    body('following_id').isInt({min: 1}).toInt(),
    validationErrors,
    followPost,
  );

// unfollow a user
router
  .route('/')
  .delete(
    authenticate,
    body('follower_id').isInt({min: 1}).toInt(),
    body('following_id').isInt({min: 1}).toInt(),
    validationErrors,
    followDelete,
  );

// Get followers count by user id
router
  .route('/followers/count/:user_id')
  .get(
    param('user_id').isInt({min: 1}).toInt(),
    validationErrors,
    followersCountByUserIdGet,
  );

// Get followings count by user id
router
  .route('/followings/count/:user_id')
  .get(
    param('user_id').isInt({min: 1}).toInt(),
    validationErrors,
    followingsCountByUserIdGet,
  );

export default router;
