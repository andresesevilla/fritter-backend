import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  anxietyShieldEnabled: boolean;
  anxietyReasons: Array<string>;
  briefingModeEnabled: boolean;
  lastBriefingRefresh: Date;
  briefingSize: number;
  briefingRefreshPeriod: number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  // Whether Anxiety Shield is enabled
  anxietyShieldEnabled: {
    type: Boolean,
    required: true
  },
  // Anxiety inducing subjects for this user
  anxietyReasons: {
    type: [
      { type: String }
    ],
    required: true
  },
  // Whether Briefing Mode is enabled
  briefingModeEnabled: {
    type: Boolean,
    required: true
  },
  // The date the user joined
  lastBriefingRefresh: {
    type: Date,
    required: true
  },
  // The user's briefing size
  briefingSize: {
    type: Number,
    min: 5,
    required: true
  },
  // The user's briefing size
  briefingRefreshPeriod: {
    type: Number,
    min: 1,
    required: true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
