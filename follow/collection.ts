import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, updating, and deleting follows.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Create a follow
   *
   * @param {string} followerId - The id of the user creating the follow
   * @param {string} followeeId - The id of the user being followed
   * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
   */
  static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      followerId,
      followeeId
    });
    await follow.save(); // Saves follow to MongoDB
    return follow.populate(['followerId', 'followeeId']);
  }

  /**
   * Get a user's following
   *
   * @param {string} username - User whose following we are looking up
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
   */
  static async findAllFollowingByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({ followerId: user._id }).populate(['followerId', 'followeeId']);
  }

  /**
   * Get a user's followers
   *
   * @param {string} username - User whose followers we are looking up
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
   */
  static async findAllFollowersByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({ followeeId: user._id }).populate(['followerId', 'followeeId']);
  }

  //   /**
  //    * Find a follow by followId
  //    *
  //    * @param {string} followId - The id of the follow to find
  //    * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given followId, if any
  //    */
  //   static async findOne(followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
  //     return FollowModel.findOne({_id: followId}).populate('authorId');
  //   }

  //   /**
  //    * Delete a follow with given followId.
  //    *
  //    * @param {string} followId - The followId of follow to delete
  //    * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
  //    */
  //   static async deleteOne(followId: Types.ObjectId | string): Promise<boolean> {
  //     const follow = await FollowModel.deleteOne({_id: followId});
  //     return follow !== null;
  //   }

  //   /**
  //    * Delete all the follows by the given author
  //    *
  //    * @param {string} authorId - The id of author of follows
  //    */
  //   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
  //     await FollowModel.deleteMany({authorId});
  //   }
}

export default FollowCollection;
