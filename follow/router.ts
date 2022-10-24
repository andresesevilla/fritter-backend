import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Create a new follow.
 *
 * @name POST /api/follows
 *
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollow
  ],
  async (req: Request, res: Response) => {
    const follower = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const followee = await UserCollection.findOneByUsername(req.body.username);
    const follow = await FollowCollection.addOne(follower, followee.id);
    res.status(201).json({
      message: 'Your follow was created successfully.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow.
 *
 * @name DELETE /api/follows
 *
 * @return {FollowResponse} - The deleted follow
 * @throws {403} - If the user is not logged in
 */
 router.delete(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidUnfollow
  ],
  async (req: Request, res: Response) => {
    const follower = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const followee = await UserCollection.findOneByUsername(req.params.username);

    if (FollowCollection.deleteOne(follower, followee.id)) {
      res.status(201).json({
        message: 'Your follow was deleted successfully',
      });
    } else {
      res.status(400).json({
        message: 'Your follow was not deleted',
      });
    }
  }
);

/**
 * Get following by user.
 *
 * @name GET /api/follows?followerId=id
 *
 * @return {FreetResponse[]} - An array of follows created by user with id, followerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowLookup
  ],
  async (req: Request, res: Response) => {
    if (req.query.followerId && req.query.followeeId) {
      const follow = await FollowCollection.findOneFollowByUsernames(req.query.followerId as string, req.query.followeeId as string);
      if (!follow) {
        res.status(200).json({
          message: 'This follow does not exist',
        });
      } else {
        const response = util.constructFollowResponse(follow);
        res.status(200).json(response);
      }
    } else if (req.query.followerId) {
      const user = await FollowCollection.findAllFollowingByUsername(req.query.followerId as string);
      const response = user.map(util.constructFollowResponse);
      res.status(200).json(response);
    } else if (req.query.followeeId) {
      const user = await FollowCollection.findAllFollowersByUsername(req.query.followeeId as string);
      const response = user.map(util.constructFollowResponse);
      res.status(200).json(response);
    } else {
      res.status(400).json({
        error: {
          password: 'You may not request follows without a specific follower or followee'
        }
      });
    }
  }
);

export { router as followRouter };
