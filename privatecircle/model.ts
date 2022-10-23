import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Private Circle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Private Circle on the backend
export type PrivateCircle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string,
  ownerId: Types.ObjectId;
};

export type PopulatedPrivateCircle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string,
  ownerId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Private Circles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PrivateCircleSchema = new Schema<PrivateCircle>({
  // The name of the Private Circle
  name: {
    type: String,
    required: true
  },
  // The owner userId
  ownerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

const PrivateCircleModel = model<PrivateCircle>('PrivateCircle', PrivateCircleSchema);
export default PrivateCircleModel;
