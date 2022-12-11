import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  collection_symbol: string;

  @Prop({ required: true, default: 0 })
  royalty: number;

  @Prop({ required: true, default: 0 })
  policy: number;
}

export type RoomDocument = Room & Document;

export const RoomSchema = SchemaFactory.createForClass(Room);
