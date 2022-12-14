import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SpaceAccessLog {
  @Prop({ required: true })
  collection_symbol: string;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop()
  referer: string;

  @Prop()
  host: string;

  @Prop()
  origin: string;

  createdAt: Date;
}

export type SpaceAccessLogDocument = SpaceAccessLog & Document;

export const SpaceAccessLogSchema =
  SchemaFactory.createForClass(SpaceAccessLog);
