import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { User } from 'src/models/user.schema';

interface ListResponse {
  message: string;
  data: User;
  statusCode: number;
}

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(
    @Body() createListDto: CreateListDto,
  ): Promise<ListResponse> {
    return this.listService.addToList(createListDto);
  }

  // TODO: add user id to the body until we have auth, then we can get it from the req.user
  @Delete(':id')
  async removeFromList(
    @Param('id') id: string,
    @Body() { userId }: { userId: string },
  ): Promise<ListResponse> {
    return this.listService.removeFromList(id, userId);
  }
}
