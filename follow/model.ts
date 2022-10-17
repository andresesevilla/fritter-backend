import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follow = {
  _id: Types.ObjectId;
  followee: User;
  follower: User;
};

const FollowSchema = new Schema<Follow>({
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;

