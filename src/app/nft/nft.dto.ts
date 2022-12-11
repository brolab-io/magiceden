import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNFTDTO {
  @IsString()
  @IsNotEmpty()
  nft_address: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  royalty_fee: number;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
