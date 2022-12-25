import { IsArray, IsOptional } from 'class-validator';

export class CreateMySpaceDto {
  @IsOptional()
  @IsArray()
  entities: any;
}
