import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import PrivateCircleCollection from './collection';

/**
 * Checks if this is a valid Private Circle creation
 */
const isValidCreatePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    if (!name.trim()) {
        res.status(400).json({
          error: 'Private Circle name must be at least one character long.'
        });
        return;
      }
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (privateCircle) {
        res.status(400).json({
            error: {
                privateCircleExists: `Private Circle with name ${name} already exists.`
            }
        });
        return;
    }
    next();
};

/**
 * Checks if this is a valid Private Circle deletion
 */
 const isValidDeletePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.privateCircle;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (!privateCircle) {
        res.status(404).json({
            error: {
                privateCircleExists: `Private Circle with name ${name} does not exist.`
            }
        });
        return;
    }
    next();
};

/**
 * Checks if this is a valid Private Circle update
 */
 const isValidUpdatePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.privateCircle;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (!privateCircle) {
        res.status(404).json({
            error: {
                privateCircleExists: `Private Circle with name ${name} does not exist.`
            }
        });
        return;
    }
    const userToUpdate = await UserCollection.findOneByUsername(req.body.username);
    if (!userToUpdate) {
        res.status(404).json({
            error: {
                userExists: `User with with username ${req.body.username} does not exist.`
            }
        });
        return;
    }
    if (userToUpdate.id === userId) {
        res.status(400).json({
            error: {
                yourselfInCircle: `You cannot have yourself in your own Private Circle.`
            }
        });
        return;
    }
    next();
};

export {
    isValidCreatePrivateCircle,
    isValidDeletePrivateCircle,
    isValidUpdatePrivateCircle
};
