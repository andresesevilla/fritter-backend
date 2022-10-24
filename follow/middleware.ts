import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

/**
 * Checks if follow is valid
 */
const isValidFollow = async (req: Request, res: Response, next: NextFunction) => {

    // Must supply a user to follow
    const followeeUsername = req.body.username;
    if (!followeeUsername) {
        res.status(400).json({ error: 'Missing username to follow' });
        return;
    }

    // Cannot follow yourself
    const follower = await UserCollection.findOneByUserId(req.session.userId);
    if (followeeUsername === follower.username) {
        res.status(400).json({ error: 'You cannot follow yourself' });
        return;
    }

    // Must be an existing user
    const followee = await UserCollection.findOneByUsername(followeeUsername);
    if (!followee) {
        res.status(400).json({ error: 'Must be a valid username to follow' });
        return;
    }

    // Cannot be someone you already follow
    const follow = await FollowCollection.findOneFollowByUsernames(follower.username, followee.username)
    if (follow) {
        res.status(400).json({ error: 'Cannot be someone you already follow' });
        return;
    }

    next();
};

/**
 * Checks if unfollow is valid
 */
const isValidUnfollow = async (req: Request, res: Response, next: NextFunction) => {

    // Must supply a user to unfollow
    const followeeUsername = req.params.username;
    if (!followeeUsername) {
        res.status(400).json({ error: 'Missing username to unfollow' });
        return;
    }

    // Must be an existing user
    const followee = await UserCollection.findOneByUsername(followeeUsername);
    if (!followee) {
        res.status(400).json({ error: 'Must be a valid username to unfollow' });
        return;
    }

    next();
};

/**
 * Checks if follow lookup is valid
 */
const isValidFollowLookup = async (req: Request, res: Response, next: NextFunction) => {

    // Must be valid followee
    const followeeUsername = req.query.followeeId as string;
    if (followeeUsername) {
        const followee = await UserCollection.findOneByUsername(followeeUsername);
        if (!followee) {
            res.status(400).json({ error: 'Must be a valid followee' });
            return;
        }
    }

    // Must be valid follower
    const followerUsername = req.query.followerId as string;
    if (followerUsername) {
        const follower = await UserCollection.findOneByUsername(followerUsername);
        if (!follower) {
            res.status(400).json({ error: 'Must be a valid follower' });
            return;
        }
    }

    next();
};

export {
    isValidFollow,
    isValidUnfollow,
    isValidFollowLookup
};
