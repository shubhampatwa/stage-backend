import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.servce';

@Module({
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
