import type {NextFunction, Request, Response} from 'express';
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

export {router as privateCircleRouter};