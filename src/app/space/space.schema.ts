import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true, unique: true })
  collection_symbol: string;

  @Prop({ type: MSSchema.Types.Mixed })
  createdAgent: Record<string, any>;
}

export type SpaceDocument = Space & Document;

export const SpaceSchema = SchemaFactory.createForClass(Space);
