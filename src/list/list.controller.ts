import { Body, Controller, Post } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(@Body() createListDto: CreateListDto) {
    return this.listService.addToList(createListDto);
  }
}
