import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
// import * as freetValidator from '../freet/middleware';
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
  async (req: Request, res: Response) => {

    if (req.query.followerId) {
      const userFollowing = await FollowCollection.findAllFollowingByUsername(req.query.followerId as string);
      const response = userFollowing.map(util.constructFollowResponse);
      res.status(200).json(response);
    } else if (req.query.followeeId) {
      const userFollowing = await FollowCollection.findAllFollowersByUsername(req.query.followeeId as string);
      const response = userFollowing.map(util.constructFollowResponse);
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


//
// /**
//  * Delete a freet
//  *
//  * @name DELETE /api/freets/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in or is not the author of
//  *                 the freet
//  * @throws {404} - If the freetId is not valid
//  */
// router.delete(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier
//   ],
//   async (req: Request, res: Response) => {
//     await FreetCollection.deleteOne(req.params.freetId);
//     res.status(200).json({
//       message: 'Your freet was deleted successfully.'
//     });
//   }
// );

export { router as followRouter };
