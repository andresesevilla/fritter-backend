import type { HydratedDocument, Types } from 'mongoose';
import type { Freet } from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import type { Follow, PopulatedFollow } from '../follow/model';
import PrivateCircleCollection from '../privatecircle/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Check if user has access to a freet by freetId
   *
   * @param {string} userId - The id of the user
   * @param {string} freet - The id of the freet to check
   * @return {Promise<Boolean>} - True if user has access, false otherwise
   */
  static async checkAccess(userId: Types.ObjectId | string, freet: Freet): Promise<Boolean> {
    const privateCircleName = freet.privateCircle;
    if (!privateCircleName) {
      return true;
    }
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(freet.authorId, privateCircleName);
    if (privateCircle.ownerId._id.toString() === userId) {
      return true;
    }
    const members = privateCircle.members;
    const user = await UserCollection.findOneByUserId(userId);
    return members.includes(user.username)
  }

  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Add a freet to the collection with Private Circle
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {string} privateCircle - The name of the private circle of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOneWithPrivateCircle(authorId: Types.ObjectId | string, content: string, privateCircle: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      privateCircle
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({ _id: freetId }).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(userId: string): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    const allFreets = await FreetModel.find({}).sort({ dateCreated: -1 }).populate('authorId')
    const result = [];
    for (const freet of allFreets) {
      const accessGranted = await this.checkAccess(userId, freet);
      if (accessGranted) {
        result.push(freet);
      }
    }
    return result;
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(userId: string, username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    const freets = await FreetModel.find({ authorId: author._id }).sort({ dateCreated: -1 }).populate('authorId');
    const result = [];
    for (const freet of freets) {
      const accessGranted = await this.checkAccess(userId, freet);
      if (accessGranted) {
        result.push(freet);
      }
    }
    return result;
  }

  /**
   * Get all freets written by an author followed by user
   *
   * @param {string} userId - The username of the user
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets made by followed users
   */
  static async findAllInFeed(userId: string): Promise<Array<HydratedDocument<Freet>>> {
    // Get all of the users that this user follows
    const user = await UserCollection.findOneByUserId(userId);
    const following = await FollowCollection.findAllFollowingByUsername(user.username);

    const followingUsernames = following.map(follow => {
      const followCopy: PopulatedFollow = { ...follow.toObject() };
      const { _id: followee } = followCopy.followeeId;
      return { authorId: followee };
    })

    if (followingUsernames.length === 0) {
      return [];
    }

    const freets = await FreetModel.find({ $or: followingUsernames }).sort({ dateCreated: -1 }).populate('authorId');
    const result = [];
    for (const freet of freets) {
      const accessGranted = await this.checkAccess(userId, freet);
      if (accessGranted) {
        result.push(freet);
      }
    }
    return result;
  }

  /**
   * Gets the user's current briefing (updates it if necessary)
   *
   * @param {string} userId - The username of the user
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets made by followed users
   */
  static async findAllInBriefing(userId: string): Promise<Array<HydratedDocument<Freet>>> {
    const user = await UserModel.findOne({ _id: userId });
    const lastBriefingRefresh = user.lastBriefingRefresh;
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - lastBriefingRefresh.getTime();
    const requiredTimeDifference = user.briefingRefreshPeriod * 60 * 60 * 1000;

    if (timeDifference >= requiredTimeDifference) {
      console.log("Refresh is legal, refreshing");
      user.lastBriefingRefresh = currentTime;
      user.save();
    } else {
      console.log("Refresh is not legal, supplying cached")
    }
    return [];
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({ _id: freetId });
    return freet !== null;
  }

  /**
   * Delete all the freets by the given private circle
   *
   * @param {string} privateCircle - The name of the private circle of freets
   */
  static async deleteMany(privateCircle: string): Promise<void> {
    await FreetModel.deleteMany({ privateCircle });
  }

  /**
   * Report a freet with given reason
   *
   * @param {string} freetId - The id of the freet to be reported
   * @param {string} reason - The report reason
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async reportOne(freetId: Types.ObjectId | string, reason: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({ _id: freetId });
    const anxietyReasons = freet.anxietyReasons;
    if (!anxietyReasons.includes(reason)) {
      anxietyReasons.push(reason);
    }
    freet.anxietyReasons = anxietyReasons;
    freet.save();
    return freet.populate('authorId');
  }
}

export default FreetCollection;
