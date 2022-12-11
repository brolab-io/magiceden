import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Nft {
  @Prop({ required: true })
  nft_address: string;

  @Prop({ required: true, default: '0' })
  price: string;

  @Prop({ required: true })
  royalty_fee: string;

  @Prop({ required: true })
  owner: string;
}

export type NftDocument = Nft & Document;

export const NftSchema = SchemaFactory.createForClass(Nft);
