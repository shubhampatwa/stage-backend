import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;

  // TODO: till the time there is no login system, we will use this userId
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
