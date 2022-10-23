import type { HydratedDocument, Types } from 'mongoose';
import type { PrivateCircle } from './model';
import UserCollection from '../user/collection';
import PrivateCircleModel from './model';

/**
 * This files contains a class that has the functionality to explore private circles
 * stored in MongoDB, including adding, finding, updating, and deleting private circles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class PrivateCircleCollection {
  /**
   * Add a private circle to the collection
   *
   * @param {string} ownerId - The id of the owner of the private circle
   * @param {string} name - The name of the private circle
   * @return {Promise<HydratedDocument<PrivateCircle>>} - The newly created private circle
   */
  static async addOne(ownerId: Types.ObjectId | string, name: string): Promise<HydratedDocument<PrivateCircle>> {
    const date = new Date();
    const privateCircle = new PrivateCircleModel({
      ownerId,
      name
    });
    await privateCircle.save(); // Saves freet to MongoDB
    return privateCircle.populate('ownerId');
  }
}

export default PrivateCircleCollection;
