import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import PrivateCircleCollection from './collection';

const router = express.Router();

/**
 * Create a new Private Circle.
 *
 * @name POST /api/privatecircles
 *
 * @param {string} name - The name of the Private Circle
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const name = req.body.name;

    const privateCircle = await PrivateCircleCollection.addOne(userId, name);

    res.status(201).json({
      message: 'Your private circle was created successfully.',
      privateCircle: util.constructPrivateCircleResponse(privateCircle)
    });
  }
);


/**
 * Get private circles of a user.
 *
 * @name GET /api/privatecircles
 *
 * @return {FreetResponse[]} - An array of private circles created by user with id, ownerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const user = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const result = await PrivateCircleCollection.findAllPrivateCirclesByUsername(user);
    res.status(200).json({
      privateCircles: result.map(util.constructPrivateCircleResponse)
    });
  }
);

/**
 * Get specific private circle of a user.
 *
 * @name GET /api/privatecircles/:privateCircle
 *
 * @return {FreetResponse[]} - An array of private circles created by user with id, ownerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.get(
  '/:privateCircle',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const user = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const name = req.params.privateCircle;
    const result = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(user, name);
    res.status(200).json({
      privateCircle: util.constructPrivateCircleResponse(result)
    });
  }
);

/**
 * Delete specific private circle of a user.
 *
 * @name DELETE /api/privatecircles/:privateCircle
 *
 * @return {FreetResponse[]} - An array of private circles created by user with id, ownerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.delete(
  '/:privateCircle',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const user = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const name = req.params.privateCircle;
    await PrivateCircleCollection.deletePrivateCircleByOwnerAndName(user, name);
    res.status(200).json({
      message: "Private Circle Deleted"
    });
  }
);

export { router as privateCircleRouter };
