import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { User } from 'src/models/user.schema';
import { GetListDto } from './dto/get-list.dto';
import { Movie } from 'src/models/movie.schema';
import { TVShow } from 'src/models/tvshow.schema';

interface PaginatedList {
  myList: User['myList'];
  movie: Movie[];
  tvshow: TVShow[];
  _id: string;
}

interface ListContent {
  contentId: string;
  contentType: string;
}

interface ListResponse {
  message: string;
  data: ListContent | PaginatedList[];
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

  @Get()
  async listMyItems(@Query() getListDto: GetListDto): Promise<ListResponse> {
    return this.listService.listMyItems(getListDto);
  }
}
