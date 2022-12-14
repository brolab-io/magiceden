import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  collection_symbol: string;
}
