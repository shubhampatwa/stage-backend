import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = User & Document;
import { genre } from '../constants/constants';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  // TODO: hash password before saving
  @Prop({ required: true })
  password: string;

  @Prop({
    type: {
      favoriteGenres: {
        type: [String],
        enum: genre,
      },
      dislikedGenres: {
        type: [String],
        enum: genre,
      },
    },
  })
  preferences: {
    favoriteGenres: string[];
    dislikedGenres: string[];
  };

  @Prop([
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number, min: 1, max: 5 },
    },
  ])
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating: number;
  }[];

  @Prop([
    {
      contentId: { type: MongooseSchema.ObjectId, required: true },
      contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
    },
  ])
  myList: {
    contentId: {
      type: MongooseSchema.Types.ObjectId;
      ref: 'Movie' | 'TVShow';
    };
    contentType: {
      type: String;
      enum: ['Movie', 'TVShow'];
    };
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ 'myList.contentId': 1 });
UserSchema.index({ 'myList._id': 1 });
