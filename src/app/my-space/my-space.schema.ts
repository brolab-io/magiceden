import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSSchema } from 'mongoose';

@Schema({ timestamps: true })
export class MySpace {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true, type: MSSchema.Types.Mixed, default: [] })
  entities: any;
}

export type MySpaceDocument = MySpace & Document;
export const MySpaceSchema = SchemaFactory.createForClass(MySpace);
