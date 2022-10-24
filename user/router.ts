import type { Request, Response } from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import FollowCollection from '../follow/collection';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username, req.body.password);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Toggle Anxiety Shield status of a user account.
 *
 * @name PUT /api/users/anxietyshield
 *
 */
router.put(
  '/anxietyshield',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    user.anxietyShieldEnabled = !user.anxietyShieldEnabled;
    user.save();

    res.status(200).json({
      message: `Anxiety Shield status updated to: ${user.anxietyShieldEnabled}`
    });
  }
);

/**
 * Get Anxiety Shield status of a user account.
 *
 * @name GET /api/users/anxietyshield
 *
 */
 router.get(
  '/anxietyshield',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);

    res.status(200).json({
      status: user.anxietyShieldEnabled,
      reasons: user.anxietyReasons
    });
  }
);

/**
 * Add a personal anxiety inducing topic
 *
 * @name PATCH /api/users/anxietyshield
 */
 router.patch(
  '/anxietyshield',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidAnxietyReport
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const reason = req.body.reason;
    await UserCollection.toggleAnxietyReason(userId, reason);
    res.status(200).json({
      message: `Updated your Anxiety Reasons to toggle ${reason}.`
    });
  }
);

/**
 * Toggle Briefing Mode status of a user account.
 *
 * @name PUT /api/users/briefingmode
 *
 */
 router.put(
  '/briefingmode',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    user.briefingModeEnabled = !user.briefingModeEnabled;
    user.save();

    res.status(200).json({
      message: `Briefing Mode status updated to: ${user.briefingModeEnabled}`
    });
  }
);

/**
 * Set briefing size of a user account.
 *
 * @name PATCH /api/users/briefingmode
 *
 */
 router.patch(
  '/briefingmode',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidBriefingSize
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    const size = parseInt(req.body.size);

    user.briefingSize = size;
    user.save();

    res.status(200).json({
      message: `Briefing Mode size updated to: ${user.briefingSize}`
    });
  }
);

/**
 * Get Briefing Mode status of a user account.
 *
 * @name GET /api/users/briefingmode
 *
 */
 router.get(
  '/briefingmode',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);

    res.status(200).json({
      status: user.briefingModeEnabled,
      size: user.briefingSize
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

    if (req.body.username) {
      res.status(400).json({
        error: {
          password: 'You may not change your username. No changes were made to your account.'
        }
      });
      return;
    }

    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your password was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

export { router as userRouter };
