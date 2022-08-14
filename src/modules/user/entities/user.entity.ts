import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  userName: string;

  @Prop({ index: true, unique: true, required: true })
  accountNumber: string;

  @Prop({ index: true, unique: true, required: true })
  identityNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
