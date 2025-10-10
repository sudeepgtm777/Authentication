import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop({ select: false })
  passwordConfirm?: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop({ default: true, select: false })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    const { password, ...rest } = ret;
    return ret;
  },
});
