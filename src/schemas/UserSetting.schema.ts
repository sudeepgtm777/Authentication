import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserSettings {
  @Prop({ required: false })
  receiveNotificaton?: boolean;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
