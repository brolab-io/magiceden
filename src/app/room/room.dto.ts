import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  collection_symbol: string;

  @IsNumber()
  @Min(0)
  @Max(10000)
  royalty: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  policy: number;
}
