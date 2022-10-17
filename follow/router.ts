import type {Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

// Get following
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const following = await FollowCollection.getFollowers((req.session.userId as string) ?? '');
    res.status(200).json({
      follower: following.map(util.constructFollowResponse)
    });
  }
);

// Follow
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const followee = await UserCollection.findOneByUsername(req.body.user);
    const follow = await FollowCollection.follow(followee.id, (req.session.userId as string) ?? '');
    res.status(201).json({
      follow: util.constructFollowResponse(follow)
    });
  }
);

export {router as followRouter};
