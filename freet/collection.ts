import type { HydratedDocument, Types } from 'mongoose';
import type { Freet } from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import type {Follow, PopulatedFollow} from '../follow/model';

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
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({ dateCreated: -1 }).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({ authorId: author._id }).populate('authorId');
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
      const followCopy: PopulatedFollow = {...follow.toObject()};
      const {_id: followee} = followCopy.followeeId;
      return {authorId: followee};
    })

    return FreetModel.find({ $or:followingUsernames }).sort({ dateCreated: -1 }).populate('authorId');
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
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({ authorId });
  }
}

export default FreetCollection;
