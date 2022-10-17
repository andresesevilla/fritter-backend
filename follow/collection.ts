import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

class FollowCollection {
  static async follow(followingID: Types.ObjectId | string, followerID: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      followee: await UserCollection.findOneByUserId(followingID),
      follower: await UserCollection.findOneByUserId(followerID)
    });
    await follow.save();
    return follow;
  }

  static async getFollowers(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({follower: await UserCollection.findOneByUserId(userId)}).populate('followee');
  }
}

export default FollowCollection;
