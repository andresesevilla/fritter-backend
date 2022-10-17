import type {HydratedDocument} from 'mongoose';
import type {Follow} from '../follow/model';

type FollowResponse = {
  followee: string;
  follower: string;
};

const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false
    })
  };
  return {
    followee: followCopy.followee.username,
    follower: followCopy.follower.username
  };
};

export {
  constructFollowResponse
};
