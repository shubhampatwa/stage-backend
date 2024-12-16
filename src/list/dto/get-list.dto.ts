import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  contentType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;
}
