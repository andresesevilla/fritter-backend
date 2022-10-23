import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

/**
 * Checks if follow is valid
 */
const isValidFollow = async (req: Request, res: Response, next: NextFunction) => {

    // Must supply a user to follow
    const followeeUsername = req.body.username;
    if (!followeeUsername) {
        res.status(400).json({error: 'Missing username to follow'});
        return;
    }

    // Cannot follow yourself
    const follower = await UserCollection.findOneByUserId(req.session.userId);
    if (followeeUsername === follower.username) {
        res.status(400).json({error: 'You cannot follow yourself'});
        return;
    }

    // Must be an existing user
    const followee = await UserCollection.findOneByUsername(followeeUsername);
    if (!followee) {
        res.status(400).json({error: 'Must be a valid username to follow'});
        return;
    }

    // Cannot be someone you already follow
    const follow = await FollowCollection.findOneFollowByUsernames(follower.username, followee.username)
    console.log(follow);
    if (follow) {
        res.status(400).json({error: 'Cannot be someone you already follow'});
        return;
    }

  next();
};

export {
  isValidFollow
};
